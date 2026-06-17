# Agent Notes

This repo keeps generated API reference markdown under `docs/api/**`.

- Do not run `npm run docs:generate` unless the user explicitly asks for generated API docs or the task specifically requires TypeDoc output.
- Do not edit `docs/api/**` by hand. Treat it as generated output.
- Use `npm run docs:build` for a local VitePress site build that does not rewrite `docs/api/**`.
- Use `npm run docs:build:fresh` only when the generated TypeDoc API reference should be refreshed before building the docs site.
- If `docs/api/**` changes accidentally, revert those generated files before finishing the task and tell the user what happened.
- For ordinary source changes, prefer focused tests such as `npm.cmd test -- --run test/renderer.test.ts` on Windows, plus `npm.cmd run build:types`.

On Windows PowerShell, `npm` may be blocked by script execution policy. Use `npm.cmd` for npm scripts.

## Supply Chain Notes

Keep user-facing dependencies minimal and documented:

- Current runtime npm dependency surface is `tom-select`, plus its transitive npm dependencies `@orchidjs/sifter` and `@orchidjs/unicode-variants`.
- Current optional peer dependencies are `d3`, `ideogram`, and `@rdkit/rdkit`; keep large visualization/chemistry integrations optional unless there is a strong reason to bundle them.
- When adding or changing dependencies, update the dependency/source summary in `README.md`.
- Do not add browser CDN examples that use `@latest`; pin a concrete version instead.
- For dependency changes, run `npm.cmd audit --omit=dev`, `npm.cmd audit`, `npm.cmd audit signatures`, and `npm.cmd pack --dry-run --json` before finishing when network access is available.
- Keep GitHub Actions pinned to commit SHAs and let Dependabot update those pins.

## Release Notes

Publishing to npm and deploying docs are separate workflows:

- `.github/workflows/publish.yml` runs when a `v*.*.*` tag is pushed. It builds with Node 22, runs `npm ci`, `npm run build`, `npm test`, and publishes to npm with provenance.
- `.github/workflows/docs.yml` runs when `main` is pushed. It builds the library, runs `npm run docs:build:fresh`, and deploys the generated VitePress site to GitHub Pages.

For a normal patch release, prefer this order:

1. Merge the release branch to `main`.
2. On `main`, update `CHANGELOG.md` for the release and confirm `package.json` and `package-lock.json` are at the expected pre-release version.
3. Run `npm.cmd run docs:build:fresh` when the generated API markdown should match the release, then commit any intended `docs/api/**` changes.
4. Run the release checks, usually `npm.cmd test`, `npm.cmd run build:types`, and `npm.cmd run build`.
5. Run `npm.cmd version patch` from a clean `main` tree. This updates `package.json` and `package-lock.json`, creates the version commit, and creates the matching `vX.Y.Z` tag.
6. Push `main` first and let CI/docs deploy pass. Then push the tag with `git push origin vX.Y.Z` to publish to npm.

Do not push a release tag from a feature branch unless intentionally publishing that branch. If preparing a version bump before merge, use `npm.cmd version patch --no-git-tag-version`, commit the package files, merge to `main`, then create the release tag on `main`. The release tag should point at the exact `main` commit intended for npm so npm provenance, GitHub source, and GitHub Pages documentation line up.
