# Changelog

## 0.3.0

### Added

- **External theme / palette runtime** — maps semantic colors to concrete palette values without embedding theme data in the expression schema.
- **SVG renderer** — converts `PixelFrame` output to deterministic SVG strings with no browser, Canvas, GPU, native, or filesystem dependency.
- **JSON Schema export** — exposes the current Emotile expression JSON Schema for agent structured output and integration validation.
- **Lightweight CLI** — adds `emotile validate`, `emotile repair`, `emotile preview`, and `emotile render svg` commands.
- **Gallery examples** — adds English and Chinese examples covering composable expressions, motion, mutation, theme usage, and SVG output without creating a preset catalog.

### Changed

- README, README.zh-CN, and API docs now describe the v0.3 integration surface.
- Roadmap docs now mark v0.3 as released.

## 0.2.0

### Added

- **Animation tick API** (`tickExpression`) — deterministic pure-data motion application using explicit tick input. Supports `blink`, `breath`, `shake`, `jitter`, and `glitch` motion fields. No timers, no browser/Canvas/GPU dependency.
- **Agent helpers** (`buildExpression`) — high-level deterministic helper for constructing valid expressions from semantic options. Includes `MINIMAL_EXPRESSION` template and `AGENT_GUIDANCE` safe ranges.
- **Agent guidance documentation** — common mistakes catalog (`COMMON_AGENT_MISTAKES`) and generation constraints to help AI agents produce valid output with minimal repairs.
- **Theme and palette design proposal** (`specs/theme-palette-proposal.md`) — compares external palette input vs expression-embedded palette, defines semantic-to-concrete color mapping, and recommends a v0.2/v0.3 timeline.

### Changed

- README and README.zh-CN updated with new API examples, agent guidance, and current stage description.
- `docs/roadmap.md` and `docs/zh/roadmap.md` updated to mark v0.2 as released.

### Fixed

- `buildExpression` now validates enum options at runtime, falling back to safe defaults for invalid shapes or mark types. Ensures output always passes `validateExpression` even from untrusted callers.

## 0.1.0

### Added

- Expression validation, normalization, and repair.
- Pure-data renderer (`renderExpression`) producing `PixelFrame` output.
- Deterministic mutation (`mutateExpression`) with seed-based PRNG.
- ASCII debug preview (`renderPixelFrameToASCII`).
- CommonJS package with TypeScript declarations.
- Fixed 32x32 canvas with semantic colors (`primary`, `accent`, `shadow`, `transparent`).
