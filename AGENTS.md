# Agent Notes

This repo keeps generated API reference markdown under `docs/api/**`.

- Do not run `npm run docs:generate` unless the user explicitly asks for generated API docs or the task specifically requires TypeDoc output.
- Do not edit `docs/api/**` by hand. Treat it as generated output.
- Use `npm run docs:build` for a local VitePress site build that does not rewrite `docs/api/**`.
- Use `npm run docs:build:fresh` only when the generated TypeDoc API reference should be refreshed before building the docs site.
- If `docs/api/**` changes accidentally, revert those generated files before finishing the task and tell the user what happened.
- For ordinary source changes, prefer focused tests such as `npm.cmd test -- --run test/renderer.test.ts` on Windows, plus `npm.cmd run build:types`.

On Windows PowerShell, `npm` may be blocked by script execution policy. Use `npm.cmd` for npm scripts.
