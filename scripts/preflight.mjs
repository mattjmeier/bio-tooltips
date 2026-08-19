// Local release preflight: answers "is this repository ready to be released?"
//
// It runs the exact same validation that GitHub Actions runs, so a green
// preflight and a green CI cannot drift apart:
//
//   1. ci:release      build + a single non-watch test run
//   2. package:check   npm pack --dry-run (file list + exports sanity)
//   3. ci:docs         regenerate the TypeDoc API reference + build VitePress
//   4. lint:workflows  actionlint over .github/workflows (skipped w/ warning
//                      if actionlint is not installed)
//
// It also detects unintended working-tree mutations: a verification command
// must not modify tracked files (the only expected build output, dist/, is
// git-ignored). If anything tracked changes — most commonly a stale docs/api —
// preflight fails with a message telling you to review and commit (or revert).
//
// This does NOT require a clean tree or the main branch; those gates live in
// scripts/release.mjs, which is where you actually act.

import path from 'node:path';
import { REPO_ROOT, run, step, ok, warn, err, die, statusLines, currentBranch } from './lib.mjs';

/** Set of `git status --porcelain` lines, or die. */
function snapshot() {
  const lines = statusLines();
  if (lines === null) die('Could not read `git status`; is this a git repository?');
  return new Set(lines);
}

function fail(msg) {
  err(msg);
  process.exit(1);
}

function main() {
  const branch = currentBranch() ?? '(unknown)';
  console.log(`\nPre-flight release checks   [branch: ${branch}]`);
  console.log('  (mirrors the GitHub Actions release validation)\n');

  const before = snapshot();

  // 1. Build + tests (single run, exits).
  step('ci:release — build + test (single run)');
  if (!run('npm', ['run', 'ci:release'], { stdio: 'inherit' }).ok) {
    fail('ci:release failed: the build and/or tests did not pass. Fix these before releasing.');
  }
  ok('build + tests passed');

  // 2. Packaging sanity.
  step('package:check — npm pack --dry-run');
  if (!run('npm', ['run', 'package:check'], { stdio: 'inherit' }).ok) {
    fail('package:check failed: the packaged file list or exports look wrong.');
  }
  ok('packaging OK');

  // 3. Docs (this is the step that can legitimately rewrite docs/api).
  step('ci:docs — regenerate API docs + build VitePress site');
  if (!run('npm', ['run', 'ci:docs'], { stdio: 'inherit' }).ok) {
    fail('ci:docs failed: documentation could not be built.');
  }
  ok('docs built');

  // 4. Workflow lint (node script so we can read its distinct exit codes).
  step('lint:workflows — actionlint over .github/workflows');
  const lint = run('node', [path.join(REPO_ROOT, 'scripts', 'lint-workflows.mjs')], { stdio: 'inherit' });
  if (lint.status === 2) {
    warn('workflow lint skipped (actionlint not installed); CI will still lint');
  } else if (!lint.ok) {
    fail('workflow lint failed: fix the reported workflow problems.');
  } else {
    ok('workflows valid');
  }

  // Mutation detection: nothing tracked should have changed as a side effect.
  const after = snapshot();
  const mutations = [...after].filter((l) => !before.has(l));
  if (mutations.length > 0) {
    const docsApi = mutations.filter((l) => l.includes('docs/api/'));
    const other = mutations.filter((l) => !l.includes('docs/api/'));
    err('A verification step modified tracked files; the tree should be unchanged:');
    for (const l of mutations) console.error('    ' + l.trim());
    if (docsApi.length > 0) {
      err('');
      err('Generated API docs under docs/api/ changed, so they are out of sync with the source.');
      err('Review with `git status`, then commit the intended changes (or revert them).');
    }
    if (other.length > 0) {
      err('');
      err('Unexpected non-docs changes were produced by a verification step. Investigate before releasing.');
    }
    process.exit(1);
  }
  ok('no unintended working-tree changes');

  console.log(`\n${'✔'} preflight passed — the repository passes the same checks GitHub Actions runs.`);
  console.log('  Note: GitHub Actions remains authoritative for the final publish (see release notes).\n');
}

main();
