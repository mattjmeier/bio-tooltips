// Local GitHub Actions workflow linting via actionlint.
//
// Exit codes:
//   0  actionlint found and all workflow files are clean
//   1  actionlint found and reported errors
//   2  actionlint is not installed (skipped — see install guidance)
//
// actionlint lints `.github/workflows/*.yml` in the current directory by
// default: YAML syntax, expression syntax, and common workflow mistakes.
// It is an external binary (no npm dependency, no Docker). CI lints
// regardless of whether it is installed locally.

import { run, which, step, ok, err, warn } from './lib.mjs';

function printInstallGuide() {
  const lines = [
    'actionlint was not found on PATH, so workflow linting was skipped.',
    '',
    'Install it to catch Actions syntax/expression errors locally:',
    '  macOS (Homebrew):  brew install actionlint shellcheck',
    '  Go (any OS):       go install github.com/rhysd/actionlint/cmd/actionlint@latest',
    '  Windows:           download a release binary and add it to PATH',
    '                     https://github.com/rhysd/actionlint/releases',
    '',
    '  `shellcheck` is optional but recommended (lints shell() calls in steps).',
    '  CI still lints every workflow (see .github/workflows/ci.yml).',
  ];
  for (const l of lines) console.log('  ' + l);
}

function main() {
  step('Linting GitHub Actions workflows (actionlint)');
  if (!which('actionlint')) {
    printInstallGuide();
    process.exit(2);
  }
  const r = run('actionlint', [], { stdio: 'inherit' });
  if (r.ok) {
    ok('GitHub Actions workflows are valid');
    process.exit(0);
  }
  err(`actionlint reported ${r.status === 1 ? 'errors' : 'a problem (exit ' + r.status + ')'}`);
  warn('Fix the issues above before pushing workflow changes.');
  process.exit(1);
}

main();
