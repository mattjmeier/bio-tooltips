// Shared helpers for the local release tooling (preflight / lint / release).
//
// Deliberately small and dependency-free: Node standard library + the git,
// npm, gh, and actionlint executables already expected on a release machine.
//
// Cross-platform note: on Windows, `npm` / `npx` resolve to `.cmd` shims which
// Node cannot hand directly to CreateProcess, so those two are spawned with
// `shell: true`. Native `.exe` tools (git, node, gh, actionlint) are resolved
// against PATH + PATHEXT and spawned directly, which keeps arguments with
// spaces (e.g. a commit message) as single argv elements.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

// ---------------------------------------------------------------------------
// Process spawning
// ---------------------------------------------------------------------------

/**
 * Resolve a bare executable name to a full path on Windows (respecting
 * PATHEXT), or return it unchanged elsewhere. Returns the bare name when the
 * tool is not found so the caller gets a detectable ENOENT.
 */
export function resolveExe(name) {
  if (process.platform !== 'win32') return name;
  if (path.extname(name)) return name;
  const exts = (process.env.PATHEXT || '.COM;.EXE;.BAT;.CMD')
    .split(';')
    .map((e) => e.toLowerCase())
    .filter(Boolean);
  const dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  for (const ext of exts) {
    for (const dir of dirs) {
      const candidate = path.join(dir, name + ext);
      try {
        if (fs.existsSync(candidate)) return candidate;
      } catch {
        // ignore unreadable PATH entries
      }
    }
  }
  return name;
}

/**
 * Spawn a process synchronously and return a normalized result.
 *
 * @param {string} cmd  Executable (bare name or path). `npm`/`npx` on Windows
 *                      are auto-routed through the shell.
 * @param {string[]} args
 * @param {object} [opts]
 * @param {'inherit'|'pipe'} [opts.stdio] 'inherit' (default) streams to the
 *                      console; 'pipe' captures stdout/stderr as strings.
 * @param {string} [opts.cwd]
 * @param {string} [opts.input]
 * @param {number} [opts.timeout]
 * @returns {{ok:boolean, status:number|null, error:Error|null,
 *            stdout:string, stderr:string}}
 */
export function run(cmd, args = [], opts = {}) {
  const { stdio = 'inherit', cwd = REPO_ROOT, input, timeout, env = process.env } = opts;
  const needsShell = process.platform === 'win32' && (cmd === 'npm' || cmd === 'npx');
  const exe = needsShell ? cmd : resolveExe(cmd);
  const r = spawnSync(exe, args, {
    stdio,
    cwd,
    input,
    timeout,
    env,
    encoding: stdio === 'inherit' ? undefined : 'utf8',
    shell: needsShell,
  });
  return {
    ok: !r.error && r.status === 0,
    status: r.status,
    error: r.error ?? null,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? '',
  };
}

/** True when the given command resolves to an available executable. */
export function which(name) {
  const r = run(name, ['--version'], { stdio: 'pipe', timeout: 15000 });
  if (r.error && r.error.code === 'ENOENT') return false;
  return true;
}

// ---------------------------------------------------------------------------
// Git helpers
// ---------------------------------------------------------------------------

/** Run git, capturing output (parse-oriented by default). */
export function runGit(args, opts = {}) {
  return run('git', args, { stdio: 'pipe', ...opts });
}

/** Current branch name, or the short SHA when detached. */
export function currentBranch() {
  const r = runGit(['rev-parse', '--abbrev-ref', 'HEAD']);
  return r.ok ? r.stdout.trim() : null;
}

/** Raw `git status --porcelain` lines (empty when the tree is clean). */
export function statusLines() {
  const r = runGit(['status', '--porcelain']);
  if (!r.ok) return null;
  return r.stdout.split(/\r?\n/).map((l) => l).filter((l) => l.length > 0);
}

export function isClean() {
  const lines = statusLines();
  return lines !== null && lines.length === 0;
}

export function headSha() {
  const r = runGit(['rev-parse', 'HEAD']);
  return r.ok ? r.stdout.trim() : null;
}

export function remoteHeadSha(remote, branch) {
  const r = runGit(['rev-parse', '--verify', `refs/remotes/${remote}/${branch}`]);
  return r.ok ? r.stdout.trim() : null;
}

/**
 * @returns {null|{ahead:number, behind:number}} ahead = local-only commits,
 * behind = remote-only commits, for `branch...remoteBranch`.
 */
export function divergence(branch, remoteBranch) {
  const r = runGit(['rev-list', '--left-right', '--count', `${branch}...${remoteBranch}`]);
  if (!r.ok) return null;
  const [a, b] = r.stdout.trim().split(/\s+/).map(Number);
  return { ahead: a || 0, behind: b || 0 };
}

/** Commit SHA a tag points at (dereferencing annotated tags), or null. */
export function tagTarget(tag) {
  const r = runGit(['rev-parse', '--verify', `refs/tags/${tag}^{commit}`]);
  return r.ok ? r.stdout.trim() : null;
}

export function tagExistsLocal(tag) {
  const r = runGit(['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`]);
  return r.ok;
}

export function tagExistsRemote(tag) {
  const r = runGit(['ls-remote', '--tags', 'origin', tag]);
  if (!r.ok) return null; // network/unknown — indeterminate
  return r.stdout.trim().length > 0;
}

export function remoteUrl(remote = 'origin') {
  const r = runGit(['remote', 'get-url', remote]);
  return r.ok ? r.stdout.trim() : null;
}

/** Last commit subject line. */
export function lastCommitSubject() {
  const r = runGit(['log', '-1', '--format=%s']);
  return r.ok ? r.stdout.trim() : null;
}

export function originMainSha() {
  return remoteHeadSha('origin', 'main');
}

export function fetchOrigin() {
  return runGit(['fetch', 'origin', 'main'], { timeout: 60000 });
}

// ---------------------------------------------------------------------------
// package.json
// ---------------------------------------------------------------------------

export function readPackageVersion() {
  const raw = fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8');
  return JSON.parse(raw).version;
}

export function readLockVersion() {
  const raw = fs.readFileSync(path.join(REPO_ROOT, 'package-lock.json'), 'utf8');
  const lock = JSON.parse(raw);
  // npm v2+ lockfile: top-level name + version.
  return lock?.version ?? lock?.packages?.['']?.version ?? null;
}

// ---------------------------------------------------------------------------
// Interaction + output
// ---------------------------------------------------------------------------

const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
const paint = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);

export const step = (m) => console.log(`\n${paint('1', '▸ ' + m)}`);
export const info = (m) => console.log(`  ${m}`);
export const ok = (m) => console.log(`  ${paint('32', '✓')} ${m}`);
export const warn = (m) => console.log(`  ${paint('33', '⚠')} ${m}`);
export const err = (m) => console.error(`  ${paint('31', '✗')} ${m}`);

/** Print an error and exit non-zero. */
export function die(msg, code = 1) {
  console.error(`\n${paint('1;31', '✗ ' + msg)}`);
  process.exit(code);
}

/**
 * Prompt `[y/N]` on the TTY and resolve to a boolean. Refuses to run
 * unattended: without a TTY it aborts rather than silently approving.
 */
export async function confirm(question) {
  if (!process.stdin.isTTY) {
    die(`Approval required but no interactive terminal is available: ${question}`);
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${question} [y/N] `);
    return ['y', 'yes'].includes(answer.trim().toLowerCase());
  } finally {
    rl.close();
  }
}
