# Writing Guidelines

These guidelines keep Emotile docs concise, consistent, and aligned with `AGENTS.md`.

## Docs vs Issues

- **Long-term planning** belongs in `docs/`, not indefinitely open issues.
- **Open issues** should default to Builder-executable tasks or short-term actionable work.
- **Planning issues** must be closed after decisions are made, and conclusions migrated to docs.

## Bilingual Docs

- English and Chinese docs should keep broadly consistent structure.
- Do not duplicate large source-code sections in docs.
- Each language should be self-contained.

## Decision Records

Each decision record should include:

- **Decision** — what was decided
- **Context** — why the decision was needed
- **Consequences** — what follows from the decision
- **Deferred alternatives** — what was intentionally postponed

## What to Avoid

- Do not turn roadmap into an unlimited wishlist.
- Do not create enterprise-heavy process docs.
- Do not duplicate `AGENTS.md` content in docs.
- Do not add large source-code sections that drift from the actual code.

## Review Checklist

- Builder docs changes: check whether README, spec, and `AGENTS.md` need synchronized updates.
- Architect review of docs PRs: check for conflicts with project principles.
- Keep docs lightweight and avoid enterprise-process tone.
