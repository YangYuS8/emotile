# Emotile Agent Development Rules

## Roles

Emotile uses two agent roles:

- Architect Agent
- Builder Agent

The Architect Agent plans, creates issues, maintains specs, reviews pull requests, merges approved work, and closes issues.
The Builder Agent implements scoped issues on feature branches and opens pull requests.

## Core Workflow

Issue -> Branch -> PR -> Review -> Merge -> Close

All non-trivial changes must start from an issue.

The Builder Agent must not push directly to main.
The Builder Agent must implement changes on a feature branch and submit a pull request.
The Builder Agent must link the pull request to its issue, preferably with `Closes #issue`.

The Architect Agent reviews the pull request.
Only the Architect Agent may merge pull requests or close issues.
The Architect Agent decides whether a change fits Emotile's long-term direction.

## Issue Rules

Each implementation issue should include:

- Goal
- Non-goals
- Acceptance criteria
- Suggested files, if useful
- Testing expectations

## Pull Request Rules

Each PR should include:

- Summary
- Linked issue, preferably using `Closes #issue`
- Changes made
- Verification commands
- Notes for reviewer

A PR should not expand the scope of the issue unless the Architect Agent explicitly agrees.

## Builder Agent Permissions

The Builder Agent may:

- Read issues
- Read source code
- Create branches
- Modify code
- Add tests
- Update docs
- Open PRs
- Respond to review feedback

The Builder Agent must not:

- Push to main
- Merge PRs
- Close issues
- Change repository settings
- Expand issue scope without explicit Architect approval
- Redesign public APIs without an issue
- Introduce large dependencies without approval

## Architect Agent Permissions

The Architect Agent may:

- Create issues
- Edit issues
- Close issues
- Review PRs
- Request changes
- Approve PRs
- Merge PRs
- Create milestones and labels
- Maintain roadmap and specs

The Architect Agent should avoid writing implementation code unless the change is trivial.

## Quality Gate

Before a PR is accepted, it should pass:

- pnpm typecheck
- pnpm test
- pnpm build

If the change affects public behavior, it should include tests.
If the change affects the expression format, it should update the spec.
If the change affects user-facing usage, it should update README.

If a quality gate cannot be run, the PR must explain why and list the residual risk.

## Project Principles

Emotile is an expression language and runtime, not a desktop pet.
Do not add complete preset expressions like `happy_01`.
Prefer composable visual primitives.
Agent-facing input must be validated, normalized, and repairable.
Renderer changes must not weaken the schema guarantees.
Keep v0.1 platform-independent: no browser, Canvas, GPU, window manager, or desktop-pet runtime dependency.
