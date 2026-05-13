# Emotile Publish Checklist

Use this checklist before publishing a new version to npm.

## Pre-publish

- [ ] Version bumped in `package.json` (follow SemVer).
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` produces `dist/` with `.js`, `.d.ts`, and `.map` files.
- [ ] `pnpm pack --dry-run` includes:
  - `dist/` directory
  - `package.json`
  - `README.md`
  - `README.zh-CN.md`
  - `LICENSE`
- [ ] `package.json` metadata is correct:
  - `name`, `version`, `description`
  - `main`, `types`, `exports`
  - `repository`, `bugs`, `homepage`
  - `license`, `keywords`, `files`
- [ ] Module format is intentional and documented:
  - v0.1 is **CommonJS-only** (`"type": "commonjs"`, `tsconfig.json` `"module": "commonjs"`).
  - `exports` does not claim ESM-only (`import`) pointing to a CJS artifact.
  - `exports.default` is used for universal fallback.
  - Smoke-tested with both `require()` and `import` in Node.js.
- [ ] README reflects current version and API.
- [ ] No unintentional changes to public API.

## Publish

```bash
pnpm build
pnpm pack --dry-run
pnpm publish --access public
```

## Post-publish

- [ ] Verify package page on npm shows correct readme and metadata.
- [ ] Create a Git tag for the release version.
- [ ] Push the tag to the remote repository.
