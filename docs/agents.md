# Agent Collaboration Guide

Emotile uses two agent roles: **Architect** and **Builder**.

## Roles

**Architect Agent** plans, creates issues, maintains specs, reviews pull requests, merges approved work, and closes issues.

**Builder Agent** implements scoped issues on feature branches and opens pull requests.

## Workflow

```
Issue -> Branch -> PR -> Review -> Merge -> Close
```

## Same-Account Review Fallback

When Architect and Builder share a GitHub account, GitHub does not allow formal reviews on own PRs. In this case:

- **Preferred:** Use GitHub's formal review UI when available.
- **Fallback:** The Architect leaves a top-level PR comment titled `## Architect Review Note` before merging or blocking.

## Quality Gate

Before a PR is accepted, it should pass:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Project Principles

- Emotile is a platform-independent expression language/runtime, not a desktop pet or preset expression pack.
- Do not add complete preset expressions like `happy_01`.
- Prefer composable visual primitives.
- Agent-facing input must be validated, normalized, and repairable.
- Renderer changes must not weaken the schema guarantees.
- Keep v0.1 platform-independent: no browser, Canvas, GPU, window manager, or desktop-pet runtime dependency.

For the full rules, see [`AGENTS.md`](https://github.com/YangYuS8/emotile/blob/main/AGENTS.md).
