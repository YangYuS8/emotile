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

## v0.2 Second-Stage Scope

- **Decision:** v0.2.0 ships `tickExpression`, agent helpers/guidance, and the theme/palette design proposal only. Theme/palette runtime support is deferred to v0.3 by default.
- **Context:** The merged v0.2 work already adds a behavioral API (`tickExpression`) and agent-facing helpers. Adding theme runtime now would expand renderer/schema/API review risk.
- **Consequences:** No Builder runtime issue should be opened for theme/palette unless a concrete downstream need is identified and the Architect explicitly reopens v0.2 scope.
- **Deferred alternatives:** Separate palette input, expression-embedded palette, named themes, and concrete color mapping runtime.

## v0.2 Release Readiness Handling

- **Decision:** Release readiness checkpoints are recorded in docs and short-lived issues are closed after the decision is made.
- **Context:** Release readiness is an Architect decision, not a long-running Builder task.
- **Consequences:** Any remaining release work must be converted into Builder-executable metadata or verification tasks.
- **Deferred alternatives:** Keeping release readiness issue #40 open as the release tracker.
