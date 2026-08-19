// Two-phase, resumable npm release driver for `bio-tooltips`.
//
//   npm run release -- patch | minor | major | X.Y.Z   (phase 1: prepare)
//   npm run release:publish                            (phase 2: publish)
//
// Phase 1 (prepare)
//   1. Safety checks: on `main`, clean tree, in sync with origin/main, and
//      git/npm/gh available. Stops on any failure — never stashes, resets, or
//      force-pushes.
//   2. Runs `npm run preflight` and aborts if it fails.
//   3. GATE 1 — confirm before touching version files.
//   4. `npm version <bump> --no-git-tag-version` (bumps package.json +
//      package-lock.json only), verifies the resulting versions, shows the
//      diff, and fails if anything other than the two release files changed.
//   5. GATE 2 — confirm before committing + pushing. Commits
//      `chore(release): vX.Y.Z` and pushes to origin/main (NO tag yet).
//
// Phase 2 (publish) — independently re-validates, never trusting phase 1:
//   1. On `main`, clean tree, HEAD == origin/main.
//   2. The version tag must not exist — except the idempotent case where it
//      already exists on both local and remote pointing exactly at HEAD.
//   3. GitHub Actions must have PASSED for the exact commit at HEAD (via `gh`).
//   4. GATE 3 — confirm before creating the tag. Creates `vX.Y.Z` and pushes
//      it (no --force). The tag triggers the "Publish to npm" workflow.
//
// This script never calls `npm publish`; publication is always driven by the
// pushed tag so npm provenance (trusted publishing) is preserved.

import path from 'node:path';
import {
  REPO_ROOT,
  run,
  runGit,
  step,
  info,
  ok,
  warn,
  err,
  die,
  which,
  confirm,
  currentBranch,
  isClean,
  statusLines,
  headSha,
  originMainSha,
  divergence,
  fetchOrigin,
  tagExistsLocal,
  tagTarget,
  lastCommitSubject,
  readPackageVersion,
  readLockVersion,
  remoteUrl,
} from './lib.mjs';

const EXPECTED_RELEASE_FILES = ['package.json', 'package-lock.json'];
const CI_WORKFLOW_NAME = 'Continuous Integration';
const BAD_CONCLUSIONS = new Set(['failure', 'cancelled', 'timed_out', 'action_required']);
const RUNNING_STATUSES = new Set(['in_progress', 'queued', 'pending', 'waiting']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function usage() {
  console.error(
    [
      'Usage:',
      '  npm run release -- patch        bump, commit + push (phase 1: prepare)',
      '  npm run release -- minor',
      '  npm run release -- major',
      '  npm run release -- 2.1.0        explicit target version',
      '  npm run release:publish         (phase 2) after CI passes: verify CI + tag',
      '',
      'Normal flow: run a `release` command, wait for GitHub Actions on the',
      'pushed commit, then run `release:publish` to create/push the tag.',
    ].join('\n')
  );
}

function parseArgs(argv) {
  let a = argv.slice();
  if (a[0] === 'prepare') a = a.slice(1);
  const m = a[0];
  if (m === 'publish') return { phase: 'publish' };
  if (m === 'patch' || m === 'minor' || m === 'major') return { phase: 'prepare', bump: m };
  if (/^\d+\.\d+\.\d+$/.test(m)) return { phase: 'prepare', version: m };
  return null;
}

function nextVersion(current, bump) {
  const [maj, min, pat] = current.split('.').map(Number);
  if (bump === 'major') return `${maj + 1}.0.0`;
  if (bump === 'minor') return `${maj}.${min + 1}.0`;
  if (bump === 'patch') return `${maj}.${min}.${pat + 1}`;
  throw new Error(`Unknown bump type: ${bump}`);
}

// ---------------------------------------------------------------------------
// Shared safety gates
// ---------------------------------------------------------------------------

function requireMain() {
  const branch = currentBranch();
  if (branch !== 'main') die(`Must be on branch "main" to release (current: "${branch ?? 'detached HEAD'}").`);
  ok(`on branch "main"`);
}

function requireClean() {
  if (isClean()) {
    ok('working tree is clean');
    return;
  }
  err('Working tree is not clean. Commit or stash your changes first (this script will not touch them).');
  for (const l of statusLines() ?? []) console.error('    ' + l.trim());
  die('Refusing to release from a dirty tree.');
}

function requireInSync() {
  step('Synchronizing with origin');
  const f = fetchOrigin();
  if (!f.ok) die('`git fetch origin main` failed:\n' + f.stderr.trim());
  const head = headSha();
  const origin = originMainSha();
  if (!origin) die('Could not resolve origin/main (is the "origin" remote configured?).');
  if (head !== origin) {
    const d = divergence('main', 'origin/main') ?? { ahead: -1, behind: -1 };
    if (d.behind > 0) die(`Local main is ${d.behind} commit(s) behind origin/main. Run "git pull --ff-only", then re-run.`);
    if (d.ahead > 0) die(`Local main has ${d.ahead} unpushed commit(s). Push them first, then re-run.`);
    die(`Local main (${head.slice(0, 7)}) does not match origin/main (${origin.slice(0, 7)}).`);
  }
  ok(`main is in sync with origin/main at ${head.slice(0, 7)}`);
}

function requireTools() {
  step('Checking required tools');
  if (!which('npm')) die('`npm` was not found on PATH.');
  ok('npm available');
  if (!which('gh')) die('The `gh` CLI is required to verify GitHub Actions before tagging. Install it: https://cli.github.com/');
  const auth = run('gh', ['auth', 'status'], { stdio: 'pipe', timeout: 30000 });
  if (!auth.ok) {
    die('`gh` is not authenticated. Run "gh auth login" (with SSO for this repo) so the release can verify CI.');
  }
  ok('gh available and authenticated');
}

function gitUserConfigured() {
  const name = runGit(['config', 'user.name']).stdout.trim();
  const email = runGit(['config', 'user.email']).stdout.trim();
  return Boolean(name && email);
}

function changedTrackedFiles() {
  const files = new Set();
  for (const l of statusLines() ?? []) {
    let p = l.slice(3);
    if (p.includes(' -> ')) p = p.split(' -> ').pop();
    if (p) files.add(p);
  }
  return [...files];
}

// ---------------------------------------------------------------------------
// GitHub Actions verification (for a specific commit)
// ---------------------------------------------------------------------------

function ciRunsForSha(sha) {
  const r = run(
    'gh',
    [
      'run',
      'list',
      '--commit',
      sha,
      '--limit',
      '25',
      '--json',
      'databaseId,workflowName,displayTitle,headBranch,headSha,conclusion,status,url',
    ],
    { stdio: 'pipe', timeout: 60000 }
  );
  if (!r.ok) die('Could not query GitHub Actions via `gh run list`:\n' + r.stderr.trim());
  try {
    const runs = JSON.parse(r.stdout);
    // Keep only runs for the main branch, and the latest run per workflow
    // (by databaseId) so a re-run supersedes an older failed run.
    const mainRuns = runs.filter((x) => x.headBranch === 'main');
    const byWorkflow = new Map();
    for (const x of mainRuns) {
      const prev = byWorkflow.get(x.workflowName);
      if (!prev || (x.databaseId ?? 0) > (prev.databaseId ?? 0)) byWorkflow.set(x.workflowName, x);
    }
    return [...byWorkflow.values()];
  } catch {
    die('Could not parse `gh run list` output.');
  }
}

async function verifyCiForSha(sha, { maxWaitMs = 8 * 60_000, pollMs = 20_000 } = {}) {
  step(`Verifying GitHub Actions for commit ${sha.slice(0, 7)}`);
  const deadline = Date.now() + maxWaitMs;
  for (;;) {
    const runs = ciRunsForSha(sha);
    if (runs.length === 0) {
      die('No GitHub Actions runs found for this commit yet. CI may still be starting — re-run in a few seconds.');
    }
    const bad = runs.filter((r) => BAD_CONCLUSIONS.has(r.conclusion));
    if (bad.length > 0) {
      err('GitHub Actions FAILED for this commit:');
      for (const r of bad) console.error(`    ✗ ${r.workflowName} — ${r.conclusion} — ${r.url}`);
      die('CI must pass before tagging. Fix the failing workflow (you can re-run it in the Actions UI) and re-run release:publish. No tag was created.');
    }
    const running = runs.filter((r) => RUNNING_STATUSES.has(r.status));
    if (running.length === 0) {
      const ci = runs.find((r) => r.workflowName === CI_WORKFLOW_NAME);
      if (!ci || ci.conclusion !== 'success') {
        die(`Required workflow "${CI_WORKFLOW_NAME}" did not pass (conclusion: ${ci?.conclusion ?? 'missing'}).`);
      }
      ok(`GitHub Actions passed for ${sha.slice(0, 7)}:`);
      for (const r of runs) console.log(`    ✓ ${r.workflowName} — ${r.conclusion}`);
      return true;
    }
    if (Date.now() + pollMs > deadline) {
      info('GitHub Actions is still running for this commit:');
      for (const r of running) console.log(`    … ${r.workflowName} — ${r.status} — ${r.url}`);
      info('Wait for CI to finish, then re-run:  npm run release:publish');
      process.exit(0);
    }
    info(`GitHub Actions still running (${running.length} left); re-checking in ${Math.round(pollMs / 1000)}s…`);
    await sleep(pollMs);
  }
}

// ---------------------------------------------------------------------------
// Phase 1: prepare
// ---------------------------------------------------------------------------

function detectPendingRelease(current) {
  const subject = lastCommitSubject() ?? '';
  const m = subject.match(/^chore\(release\): v?(\d+\.\d+\.\d+)$/);
  if (m && m[1] === current && !tagExistsLocal(`v${current}`)) return current;
  return null;
}

async function prepare(bump, version) {
  requireMain();
  requireClean();
  requireInSync();
  requireTools();

  const current = readPackageVersion();

  const pending = detectPendingRelease(current);
  if (pending) {
    die(
      `v${pending} is already committed and pushed but not yet tagged.\n` +
        `  To publish it:    npm run release:publish\n` +
        `  To make another:  publish (or explicitly abandon) v${pending} first.`
    );
  }

  const proposed = version ?? nextVersion(current, bump);
  if (proposed === current) die(`Proposed version equals the current version (${current}); nothing to do.`);

  // Preflight must pass before any change.
  step('Running preflight (build + test + package + docs + workflow lint)');
  const pf = run('node', [path.join(REPO_ROOT, 'scripts', 'preflight.mjs')], { stdio: 'inherit' });
  if (!pf.ok) die('Preflight failed. Nothing was changed. Fix the issues above and re-run the release.');

  // GATE 1
  printSummary({ kind: 'prepare', current, proposed, sha: headSha() });
  const g1 = await confirm('Create the version bump? (modifies package.json + package-lock.json only)');
  if (!g1) {
    info('Aborted before any change. Nothing was modified.');
    process.exit(0);
  }

  // Bump (no commit, no tag).
  const bumpArg = version ? [proposed] : [bump];
  step(`npm version ${bumpArg.join(' ')} --no-git-tag-version`);
  const bv = run('npm', ['version', ...bumpArg, '--no-git-tag-version'], { stdio: 'inherit' });
  if (!bv.ok) die('`npm version` failed. Inspect `git status` — the tree may be partially changed.');

  const newPkg = readPackageVersion();
  const newLock = readLockVersion();
  if (newPkg !== proposed) die(`package.json is now ${newPkg}; expected ${proposed}.`);
  if (newLock !== proposed) die(`package-lock.json is now ${newLock}; expected ${proposed}.`);
  ok(`version bumped to ${proposed}`);

  // Only the two release files may have changed (tree was clean beforehand).
  const changed = changedTrackedFiles();
  const unexpected = changed.filter((f) => !EXPECTED_RELEASE_FILES.includes(f));
  step('Reviewing changes (git diff)');
  runGit(['diff'], { stdio: 'inherit' });
  if (unexpected.length > 0) {
    die(
      `Unexpected files changed: ${unexpected.join(', ')}.\n` +
        `Expected only: ${EXPECTED_RELEASE_FILES.join(', ')}.\n` +
        `To undo the bump: git checkout -- package.json package-lock.json`
    );
  }

  // GATE 2
  const g2 = await confirm(`Commit "chore(release): v${proposed}" and push to origin/main? (No tag yet.)`);
  if (!g2) {
    info('Version files are modified but NOT committed or pushed.');
    info('Inspect:  git diff');
    info('To finish the release now:');
    info(`  git add package.json package-lock.json`);
    info(`  git commit -m "chore(release): v${proposed}"`);
    info('  git push origin main');
    info('  then, once CI passes:  npm run release:publish');
    info('To undo the bump instead:');
    info('  git checkout -- package.json package-lock.json');
    process.exit(0);
  }

  if (!gitUserConfigured()) die('git user.name / user.email are not configured; cannot create the commit.');

  const add = runGit(['add', ...EXPECTED_RELEASE_FILES], { stdio: 'inherit' });
  if (!add.ok) die('`git add` failed.');
  const cm = runGit(['commit', '-m', `chore(release): v${proposed}`], { stdio: 'inherit' });
  if (!cm.ok) die('`git commit` failed.');
  const push = runGit(['push', 'origin', 'main'], { stdio: 'inherit', timeout: 120000 });
  if (!push.ok) die('`git push` failed. The version commit may exist locally — check `git status` and push manually.');

  const pushedSha = headSha();
  ok(`pushed commit ${pushedSha.slice(0, 7)} (v${proposed}) to origin/main`);

  info('');
  info('Phase 1 complete. GitHub Actions is now running for this commit.');
  info('Wait for CI to finish, then run:   npm run release:publish');
  info('It will re-verify CI for this exact commit before creating the tag.');
}

// ---------------------------------------------------------------------------
// Phase 2: publish
// ---------------------------------------------------------------------------

async function publish() {
  requireMain();
  requireClean();
  requireInSync();
  requireTools();

  const head = headSha();
  const version = readPackageVersion();
  const tag = `v${version}`;

  // Tag existence: proceed only if absent everywhere, or present in the
  // idempotent case (local + remote, pointing exactly at HEAD).
  const localExists = tagExistsLocal(tag);
  const localTarget = localExists ? tagTarget(tag) : null;
  const lr = runGit(['ls-remote', '--tags', 'origin', tag], { timeout: 60000 });
  if (!lr.ok) die('Could not verify remote tags (`git ls-remote` failed). Check network and re-run.');
  const remoteExists = lr.stdout.trim().length > 0;

  if (localExists || remoteExists) {
    if (localExists && localTarget === head && remoteExists) {
      ok(`Tag ${tag} already exists locally and on origin, pointing at ${head.slice(0, 7)}.`);
      info('This release is already complete (idempotent no-op). Check the "Publish to npm" workflow for status.');
      process.exit(0);
    }
    die(
      `Tag ${tag} already exists (local: ${localExists ? (localTarget ? localTarget.slice(0, 7) : 'yes') : 'no'}, ` +
        `remote: ${remoteExists ? 'yes' : 'no'}) but does not point exactly at HEAD (${head.slice(0, 7)}) on both.\n` +
        `  This usually means the release was already made. Do NOT move an existing release tag.\n` +
        `  Inspect with: git ls-remote --tags origin ${tag}   and resolve manually.`
    );
  }

  // CI must have passed for the exact commit at HEAD.
  await verifyCiForSha(head);

  // GATE 3
  printSummary({ kind: 'publish', current: version, proposed: version, sha: head, tag, ciPassed: true });
  const g3 = await confirm(`Create and push tag ${tag}? This triggers npm publication.`);
  if (!g3) {
    info('Aborted. No tag was created.');
    process.exit(0);
  }

  const mk = runGit(['tag', tag], { stdio: 'inherit' });
  if (!mk.ok) die('`git tag` failed.');
  const t = tagTarget(tag);
  if (t !== head) die(`Tag ${tag} points at ${t}, expected ${head}. Aborting before push (no --force).`);

  const push = runGit(['push', 'origin', tag], { stdio: 'inherit', timeout: 120000 });
  if (!push.ok) die(`Pushing tag ${tag} failed. The local tag exists; resolve and push manually (no --force).`);

  ok(`Pushed ${tag} -> ${head.slice(0, 7)}. GitHub Actions will now publish to npm.`);
  info('');
  info('Follow the "Publish to npm" workflow:   gh run list --workflow "Publish to npm" --limit 1');
  info(`Remote: ${remoteUrl()}`);
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function printSummary({ kind, current, proposed, sha, tag, ciPassed }) {
  const line = '─'.repeat(56);
  console.log(`\n${line}`);
  if (kind === 'prepare') {
    console.log('  RELEASE PREPARE');
    console.log(line);
    console.log(`  branch             ${currentBranch()}`);
    console.log(`  HEAD               ${sha}`);
    console.log(`  current version    ${current}`);
    console.log(`  proposed version   ${proposed}`);
    console.log(`  preflight          passed`);
  } else {
    console.log('  RELEASE PUBLISH');
    console.log(line);
    console.log(`  branch             ${currentBranch()}`);
    console.log(`  release commit     ${sha}`);
    console.log(`  version            ${current}`);
    console.log(`  tag to create      ${tag}`);
    console.log(`  GitHub Actions     ${ciPassed ? 'passed for this commit' : 'not verified'}`);
  }
  console.log(line + '\n');
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed) {
    usage();
    process.exit(1);
  }
  if (parsed.phase === 'publish') {
    await publish();
    return;
  }
  await prepare(parsed.bump, parsed.version);
}

main().catch((e) => {
  err('Unexpected error: ' + (e?.stack || e?.message || e));
  process.exit(1);
});
