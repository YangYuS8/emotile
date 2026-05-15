# Decision Records

## Fixed 32×32 Canvas

- **Decision:** v0.1 canvas is fixed at 32×32.
- **Context:** Type system allowed 1–256, but docs and renderer assumed 32×32.
- **Consequences:** Simpler validation, consistent examples, easier testing.
- **Deferred:** Variable canvas sizes for v0.2+.

## CommonJS-Only Package

- **Decision:** v0.1 ships as CommonJS-only.
- **Context:** TypeScript emits CommonJS; dual-build adds complexity.
- **Consequences:** ESM consumers may need `createRequire` in strict environments.
- **Deferred:** ESM / dual-build for a future issue.

## Same-Account Review Fallback

- **Decision:** When Architect and Builder share a GitHub account, use top-level `## Architect Review Note` PR comments.
- **Context:** GitHub blocks formal reviews on own PRs.
- **Consequences:** Review record is in PR comments, not GitHub review UI.
- **Deferred:** Bot integration or separate accounts.

## Scoped Package Name

- **Decision:** Publish as `@yangyus8/emotile`.
- **Context:** npm rejected `emotile` as too similar to `emotion`.
- **Consequences:** Longer install command; scoped namespace.
- **Deferred:** Unscoped name if npm policy changes.

## Last-Write-Wins Pixel Conflicts

- **Decision:** Renderer deduplicates overlapping pixels with last-write-wins.
- **Context:** Multiple primitives may emit at same coordinate.
- **Consequences:** Deterministic output; render order matters.
- **Deferred:** Layer / z-index / compositor for future versions.

## Docs as Long-Term Planning Home

- **Decision:** Long-term planning belongs in `docs/`, not indefinitely open issues.
- **Context:** Open issues should be Builder-executable tasks.
- **Consequences:** Issues are actionable; roadmap/decisions live in versioned docs.
- **Deferred:** None.
