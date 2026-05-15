# What is Emotile

Emotile is a **pixel expression language and runtime for AI agents**. Instead of choosing from predefined emoji or stickers, an agent describes a facial expression using structured primitives — eyes, mouth, brows, marks, motion, and mutation.

## Why Not Predefined Emoji Packs?

Predefined expressions like `happy_01` or `sad_02` create a fixed catalog. An agent can only express what the catalog contains. Visual primitives are composable — an agent can express "proud but slightly worried" or "confused but trying" without anyone having pre-drawn that exact expression.

## Why Not Direct Pixel Control?

Direct pixel control makes validation impossible, produces unrecognizable faces from small errors, and removes the structural guarantees that let animation, scaling, and theming work. Emotile's constrained grammar gives agents enough flexibility while ensuring output is always structurally valid.

## Current Stage

**v0.1** — minimal viable library. Validates, normalizes, repairs, renders, and mutates expressions as pure data.

## Key Capabilities

- **Validate** — check if an expression is structurally valid
- **Normalize** — fill defaults, clamp values, always succeeds
- **Repair** — fix invalid shapes, clamp values, report warnings
- **Render** — produce a pixel frame (pure data, no canvas dependency)
- **Mutate** — deterministic, seed-based variation
- **Preview** — ASCII debug output for terminal inspection
