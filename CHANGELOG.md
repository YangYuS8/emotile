# Changelog

## 0.2.0

### Added

- **Animation tick API** (`tickExpression`) — deterministic pure-data motion application using explicit tick input. Supports `blink`, `breath`, `shake`, `jitter`, and `glitch` motion fields. No timers, no browser/Canvas/GPU dependency.
- **Agent helpers** (`buildExpression`) — high-level deterministic helper for constructing valid expressions from semantic options. Includes `MINIMAL_EXPRESSION` template and `AGENT_GUIDANCE` safe ranges.
- **Agent guidance documentation** — common mistakes catalog (`COMMON_AGENT_MISTAKES`) and generation constraints to help AI agents produce valid output with minimal repairs.
- **Theme and palette design proposal** (`specs/theme-palette-proposal.md`) — compares external palette input vs expression-embedded palette, defines semantic-to-concrete color mapping, and recommends a v0.2/v0.3 timeline.

### Changed

- README and README.zh-CN updated with new API examples, agent guidance, and current stage description.
- `docs/roadmap.md` and `docs/zh/roadmap.md` updated to mark v0.2 as release candidate (not yet published to npm).

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
