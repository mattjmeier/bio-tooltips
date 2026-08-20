# Agent Notes

This repo keeps generated API reference markdown under `docs/api/**`.

- Do not run `npm run docs:generate` unless the user explicitly asks for generated API docs or the task specifically requires TypeDoc output.
- Do not edit `docs/api/**` by hand. Treat it as generated output.
- Use `npm run docs:build` for a local VitePress site build that does not rewrite `docs/api/**`.
- Use `npm run docs:build:fresh` only when the generated TypeDoc API reference should be refreshed before building the docs site.
- If `docs/api/**` changes accidentally, revert those generated files before finishing the task and tell the user what happened.
- For ordinary source changes, prefer focused tests such as `npm test -- --run test/renderer.test.ts` on Windows, plus `npm run build:types`.

On Windows PowerShell, `npm` may be blocked by script execution policy. Use `npm` for npm scripts.

## Supply Chain Notes

Keep user-facing dependencies minimal and documented:

- There are currently no npm runtime dependencies.
- Current optional peer dependencies are `d3`, `ideogram`, and `@rdkit/rdkit`; keep large visualization/chemistry integrations optional unless there is a strong reason to bundle them.
- When adding or changing dependencies, update the dependency/source summary in `README.md`.
- Do not add browser CDN examples that use `@latest`; pin a concrete version instead.
- For dependency changes, run `npm audit --omit=dev`, `npm audit`, `npm audit signatures`, and `npm pack --dry-run --json` before finishing when network access is available.
- Keep GitHub Actions pinned to commit SHAs and let Dependabot update those pins.

## Release Notes

Publishing to npm and deploying docs stay separate workflows. Both now call the
canonical npm scripts (see `package.json`) so local, CI, and publish use the same
commands and cannot drift:

- `.github/workflows/publish.yml` runs when a `v*.*.*` tag is pushed. It runs `npm ci`, `npm run ci:release` (build + test, once), `npm run package:check` (`npm pack --dry-run`), then `npm publish --provenance --access public` (trusted publishing). It is never combined with docs deployment.
- `.github/workflows/docs.yml` runs when `main` is pushed. It runs `npm run build`, `npm run ci:docs` (regenerate TypeDoc + build the VitePress site), and deploys to GitHub Pages.
- `.github/workflows/ci.yml` runs on `main` pushes and pull requests. It runs `npm run ci:release` and lints the workflow files with `actionlint`.

### Preflight

`npm run preflight` answers "is this repository ready to be released?" locally. It runs `ci:release`, `package:check`, `ci:docs`, and the workflow lint, then checks that the verification steps did not unexpectedly modify any tracked files (e.g. stale generated `docs/api/**`) and fails with a message if they did. GitHub Actions remains the authoritative check; preflight only mirrors it locally.

### Two-phase release

The release is a resumable two-phase flow driven by `scripts/release.mjs`. Each phase independently re-validates the environment (on `main`, clean tree, `HEAD == origin/main`, and `git`/`npm`/`gh` available) and stops on any failure — never stashing, resetting, force-pushing, or moving an existing tag.

**Happy path:** run `npm run preflight`, then `npm run release -- patch` (also `minor`, `major`, or an explicit `X.Y.Z`). Wait for GitHub Actions on the pushed commit, then `npm run release:publish`.

**Phase 1 — `npm run release -- patch`:**

1. Safety checks + `npm run preflight`; aborts on failure (nothing changes).
2. **Gate 1** — confirm before touching the version files.
3. `npm version <bump> --no-git-tag-version` updates `package.json` + `package-lock.json` and synchronizes pinned `bio-tooltips@X.Y.Z` links in the allowlisted README/docs files through the npm `version` hook; it creates no tag, verifies the new version, shows `git diff`, and fails if anything outside the release allowlist changed.
4. **Gate 2** — confirm before committing `chore(release): vX.Y.Z` and pushing to `origin/main`. No tag yet.

**Phase 2 — `npm run release:publish`** (after CI finishes for the pushed commit):

1. Re-validates the environment and confirms the version tag does **not** already exist (a tag present locally *and* on remote pointing exactly at HEAD is an idempotent no-op).
2. Verifies GitHub Actions **passed for the exact commit at HEAD** via `gh run list --sha <sha>` (polls while runs are in progress). The tag is created only *after* CI so the published package always corresponds to a commit whose tests already passed in CI.
3. **Gate 3** — confirm before creating and pushing `vX.Y.Z` (no `--force`). The tag triggers `publish.yml`.

`release:publish` never calls `npm publish`; the pushed tag always drives publication so npm provenance is preserved.

### Recovery

- **Preflight fails:** nothing is committed or tagged. Fix and re-run.
- **Bumped but commit/push declined:** the tree is left modified (not committed). Inspect with `git diff`, undo the allowlisted version and documentation files shown by the release command, or re-run the release command to resume.
- **Pushed but CI fails:** no tag is created and the version commit is untouched. Fix CI normally (e.g. re-run the failed workflow in the Actions UI), then re-run `npm run release:publish`. It does not bump the version again — it operates on the version already in `package.json`.
- **Tag already exists:** the script stops with a clear error unless it points exactly at the expected commit; it never moves an existing release tag.

### Workflow linting

`npm run lint:workflows` runs `actionlint` over `.github/workflows/**` locally and prints an install guide (brew / go / release binary) if `actionlint` is not on PATH. CI runs the same check in the "Lint GitHub Workflows" job of `ci.yml`. `act` is an optional local debug tool and is not required.
