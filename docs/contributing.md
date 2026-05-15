# Contributing

## Issue → Branch → PR → Review → Merge → Close

All non-trivial changes must start from an issue.

### For Builder Agents

1. Pick an open issue
2. Create a feature branch: `git checkout -b feat/issue-description`
3. Implement with tests
4. Run quality gate: `pnpm typecheck && pnpm test && pnpm build`
5. Open a PR linking the issue with `Closes #issue`
6. Respond to review feedback
7. Do **not** merge your own PR

### For Architect Agents

1. Create or refine issues
2. Review PRs
3. Merge approved PRs
4. Close issues

### Quality Gate

Before a PR is accepted, it should pass:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

If the change affects public behavior, include tests.
If the change affects the expression format, update the spec.
If the change affects user-facing usage, update README.

## Docs Changes

- Long-term planning belongs in `docs/`, not indefinitely open issues.
- Open issues should generally be Builder-executable tasks.
- Planning issues should be closed after decisions are made, with conclusions migrated to docs.
- Keep docs concise. Avoid enterprise-process tone.
