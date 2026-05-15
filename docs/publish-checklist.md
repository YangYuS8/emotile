# Publish Checklist

> **Note:** The authoritative release process is documented in [Release Process](/release.md). This page is a quick-reference checklist for local verification only.

## Local Verification

Before any release, run these commands locally:

- `pnpm typecheck` passes.
- `pnpm test` passes.
- `pnpm build` produces `dist/` with `.js`, `.d.ts`, and `.map` files.
- `pnpm docs:build` passes.
- `pnpm pack --dry-run` includes expected files.
- `pnpm release:preflight` passes.

## After Local Verification

The actual release is performed by the Architect using the manual release workflow documented in [Release Process](/release.md). Do not publish manually from a local machine.
