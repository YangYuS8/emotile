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
