# API Reference

## Core Functions

### `validateExpression(input)`

Validates an expression object. Returns `{ ok: true, value }` or `{ ok: false, errors }`.

### `normalizeExpression(input)`

Fills missing fields with defaults and clamps out-of-range values. Always returns a complete `EmotileExpression`.

### `repairExpression(input)`

Fixes invalid shapes, clamps values, and fills missing fields. Returns `{ value, warnings }`.

### `renderExpression(expression)`

Renders a normalized expression into a `PixelFrame` — a pure data structure with `width`, `height`, and `pixels[]`.

### `mutateExpression(expression, options)`

Produces a deterministic variation of an expression.

- `options.seed`: string or number for reproducibility
- `options.amount`: 0–1 variation intensity

### `renderPixelFrameToASCII(frame)`

Converts a `PixelFrame` to an ASCII string for terminal debug output.

### `tickExpression(expression, tick)`

Applies motion fields to an expression using an explicit integer tick. Deterministic — same expression and tick always produce the same output. No timers or side effects. Returns a new expression that can be rendered.

Motion fields active in v0.2:
- `blink` — periodic eye closure
- `breath` — sine-wave squash and vertical shift
- `shake` — sine/cosine offset on eyes and mouth
- `jitter` — deterministic random micro-movements
- `glitch` — occasional deterministic random shape swaps

### `buildExpression(options?)`

Constructs a valid, normalized expression from high-level semantic options. All values are clamped automatically; invalid enum options fall back to safe defaults.

Example:
```ts
const expr = buildExpression({
  eyeShape: "arc",
  mouthShape: "smile",
  curve: 0.5,
  marks: ["heart"],
});
```

### `AGENT_GUIDANCE`

Recommended safe ranges and constraints for AI agents generating expressions. Includes default positions, safe numeric ranges, and maximum recommended marks.

### `MINIMAL_EXPRESSION`

A copy-paste-safe starting template with all required fields present and optional fields omitted. Can be passed directly to `validateExpression`.

### `COMMON_AGENT_MISTAKES`

A catalog of frequent generation errors and how `repairExpression` fixes them. Use this for self-correcting agent output.

## Types

Key exported types:

- `EmotileExpression` — top-level expression object
- `PixelFrame` — rendered output
- `Pixel` — individual pixel with `x`, `y`, `color`
- `ValidationResult<T>` — validation result type
- `RepairResult` — repair result type

## Schema Constants

Exported from `schema`:

- `FACE_SHAPES`, `EYE_SHAPES`, `MOUTH_SHAPES`, `MARK_TYPES`
- `DEFAULT_EXPRESSION`, `DEFAULT_CANVAS`, etc.
