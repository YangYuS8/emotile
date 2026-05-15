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

## Theme / Palette

### `applyTheme(frame, options?)`

Maps semantic colors in a `PixelFrame` to concrete hex colors using an external theme. Returns a `ThemedFrame` with `pixels` containing string colors and a resolved `theme` object.

```ts
import { applyTheme, renderExpression } from "@yangyus8/emotile";

const frame = renderExpression(expr);
const themed = applyTheme(frame, { theme: { primary: "#3b82f6", accent: "#f59e0b" } });
```

### `DEFAULT_THEME`

Default palette mapping:
- `primary`: `#1a1a2e`
- `accent`: `#e94560`
- `shadow`: `#533483`
- `background`: `#ffffff`

### `normalizeTheme(theme?)`

Fills missing palette keys with defaults and falls back invalid hex strings.

## SVG Renderer

### `renderPixelFrameToSVG(frame, options?)`

Converts a `PixelFrame` to a deterministic SVG string. No DOM, Canvas, or browser dependency.

Options:
- `pixelSize`: pixel size in SVG units (default 10)
- `theme`: optional custom palette
- `background`: whether to fill the background (default false)
- `classPrefix`: CSS class prefix (default `"emotile"`)

```ts
const svg = renderPixelFrameToSVG(frame, { pixelSize: 20, background: true });
```

## JSON Schema

### `EMOTILE_EXPRESSION_SCHEMA`

A hand-maintained JSON Schema object describing the current expression format.

### `getExpressionSchema()`

Returns a deep copy of the schema. Use this for agent structured output constraints.

```ts
import { getExpressionSchema } from "@yangyus8/emotile";
const schema = getExpressionSchema();
```

## CLI

Install globally or use via `npx`:

```bash
npx @yangyus8/emotile validate expr.json
npx @yangyus8/emotile repair expr.json
npx @yangyus8/emotile preview expr.json
npx @yangyus8/emotile render svg expr.json
```

Commands:
- `validate <file>` — validate expression JSON, exit 0 if valid, 1 if invalid
- `repair <file>` — repair expression and output JSON to stdout
- `preview <file>` — render ASCII preview
- `render svg <file>` — render SVG output
- `help` — show usage

Exit codes: 0 for success, 1 for invalid input, error, or unknown command.

## Schema Constants

Exported from `schema`:

- `FACE_SHAPES`, `EYE_SHAPES`, `MOUTH_SHAPES`, `MARK_TYPES`
- `DEFAULT_EXPRESSION`, `DEFAULT_CANVAS`, etc.
