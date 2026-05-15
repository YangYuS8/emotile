# Release Process

This document describes how Emotile releases are prepared, checked, triggered, retried, and reviewed. It covers the responsibilities of the Architect and Builder roles and the concrete steps required for a manual release.

## Roles

Emotile uses two agent roles. Release authority is split between them.

### Builder

- May implement release automation, tests, docs, and fixes on feature branches.
- Must open a PR for any release-related change.
- **Must not** trigger the official release workflow.
- **Must not** merge release PRs.
- **Must not** create git tags or GitHub Releases.
- **Must not** publish to npm.

### Architect

- Reviews and merges release-related PRs.
- Triggers the official release workflow via `workflow_dispatch`.
- Is responsible for the version declared in `package.json` and `CHANGELOG.md`.
- Creates git tags and GitHub Releases only through the approved workflow.
- Decides whether a retry is safe after a partial failure.

## Workflows

### Release Preflight

`.github/workflows/release-preflight.yml`

Runs automatically on every PR targeting `main`, and can be triggered manually via `workflow_dispatch`.

Preflight checks:

1. `package.json` version matches `CHANGELOG.md`.
2. `pnpm typecheck` passes.
3. `pnpm test` passes.
4. `pnpm build` passes.
5. `pnpm docs:build` passes.
6. `pnpm pack --dry-run` succeeds.
7. CLI smoke test (`emotile validate examples/shy.json`).
8. Library import smoke test (`dist/index.js` public API).

The preflight is read-only. It does not publish, tag, or create releases.

### Manual Release

`.github/workflows/release.yml`

Triggered only by `workflow_dispatch`. The Architect provides the version (e.g. `0.4.0`).

Steps:

1. Verify `package.json` version matches the input.
2. Verify `CHANGELOG.md` contains a section for the input version.
3. Run the full quality gate (typecheck, test, build, docs:build, pack dry-run).
4. Extract release notes from `CHANGELOG.md`.
5. Publish to npm (OIDC preferred; `NPM_TOKEN` fallback).
6. Create git tag `vX.Y.Z`.
7. Create GitHub Release with notes from `CHANGELOG.md`.

## Architect Release Checklist

Before triggering the release workflow:

- [ ] `package.json` version is correct and committed to `main`.
- [ ] `CHANGELOG.md` contains a section for the target version.
- [ ] CI is green on the latest `main` commit.
- [ ] Release Preflight passes on the latest `main` commit.
- [ ] Docs build passes locally.
- [ ] All open issues planned for this version are merged and closed.
- [ ] npm Trusted Publishing is configured, or `NPM_TOKEN` secret is set.

After the workflow completes:

- [ ] npm package shows the new version.
- [ ] Git tag `vX.Y.Z` exists.
- [ ] GitHub Release exists with correct release notes.
- [ ] Docs site is up to date (if applicable).

## Builder Expectations for Release PRs

When opening a PR that touches release automation:

1. Link the related issue with `Closes #issue`.
2. List verification commands and their results.
3. Note anything that could not be tested locally (e.g. workflow dispatch wiring, actual npm publish, tag creation).
4. List residual risks explicitly.
5. Do not trigger the release workflow.

## Failure Handling and Retry Rules

### Before any publish side effect

If the workflow fails during checks (version mismatch, test failure, build failure, docs failure, pack dry-run failure):

- Fix the problem on a feature branch.
- Open a PR.
- After merge, re-run the release workflow.

No tag, release, or publish has occurred, so retry is safe.

### After publish but before tag

If npm publish succeeds but tag creation fails:

- The package version is now on npm.
- Do **not** re-run the workflow with the same version, because `pnpm publish` will fail (version already exists).
- Manually create the git tag and GitHub Release, or bump the version and retry with a patch release.

### After tag but before GitHub Release

If the tag was created but the GitHub Release step failed:

- The tag exists and the package is on npm.
- Create the GitHub Release manually with `gh release create` or the GitHub web UI.
- Use the same release notes from `CHANGELOG.md`.

### After partial publish (OIDC fails, fallback succeeds)

If OIDC publish fails but the `NPM_TOKEN` fallback succeeds:

- The release is valid but may not have npm provenance.
- Log the OIDC failure for later investigation.
- Do not retry unless provenance is critical for this release.

## npm Trusted Publishing / OIDC Setup

Emotile prefers npm Trusted Publishing (OIDC) over long-lived tokens.

### Configure on npm

1. Go to the package page on npm: `https://www.npmjs.com/package/@yangyus8/emotile`.
2. Open **Publishing access & 2FA** > **Trusted Publishers**.
3. Add a new trusted publisher:
   - **Publisher type**: GitHub Actions
   - **Repository**: `YangYuS8/emotile`
   - **Workflow name**: `release.yml`

### What the workflow needs

The release workflow requests two permissions:

- `contents: write` — to push git tags and create GitHub Releases.
- `id-token: write` — to exchange a short-lived OIDC token with npm.

No `NPM_TOKEN` secret is required when Trusted Publishing is active.

## NPM_TOKEN Fallback

If Trusted Publishing is not yet configured, the workflow falls back to a classic npm automation token.

1. Generate an **automation token** on npm (Account > Access Tokens > Generate New Token > Automation).
2. Add it as a repository secret named `NPM_TOKEN`.
3. The workflow will use it if OIDC publish fails.

The fallback path is clearly separated in the workflow YAML. It is acceptable for early releases but should be replaced by Trusted Publishing as soon as practical.

## Release Notes Source

Release notes are always extracted from `CHANGELOG.md`. The workflow uses `scripts/extract-release-notes.mjs` to pull the section for the target version.

If `CHANGELOG.md` does not contain the target version, the workflow fails before any side effect.

## References

- [AGENTS.md](https://github.com/YangYuS8/emotile/blob/main/AGENTS.md) — role definitions and permissions
- [docs/v0.4-plan.md](/v0.4-plan.md) — release automation planning
- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)
