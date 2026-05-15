# Agent Integration Guide

This guide shows how downstream agents can generate and process Emotile expressions using the existing v0.3 public API.

Emotile is a platform-independent expression language. You can use it from any host that can run JavaScript or call a CLI, including OpenClaw, Hermes, or custom agent frameworks. This guide does not require any specific host.

## Use JSON Schema for Structured Generation

Emotile exports a hand-maintained JSON Schema that mirrors the TypeScript types:

```typescript
import { getExpressionSchema, EMOTILE_EXPRESSION_SCHEMA } from "@yangyus8/emotile";

const schema = getExpressionSchema(); // deep copy, safe to mutate
```

Use this schema when requesting structured JSON output from an LLM. The schema defines:

- Required fields (`version`, `canvas`, `face`, `eyes`, `mouth`)
- Valid enum values for shapes
- Numeric ranges for coordinates, sizes, and intensity

::: warning Schema is a guide, not a guarantee
Even when an LLM is given the JSON Schema, its output may contain:

- Out-of-range numbers
- Invalid enum strings
- Missing fields
- Type mismatches

**Always run validation and repair after generation.**
:::

## Recommended Pipeline

The safest way to go from a generated candidate to rendered output:

```
Generate candidate
    |
    v
validateExpression() ── invalid? ──> repairExpression()
    |                                    |
    v                                    v
normalizeExpression() <────────────────┘
    |
    v
renderExpression() ──> PixelFrame (semantic colors)
    |
    +---> renderPixelFrameToSVG({ theme }) ──> SVG string
    |
    +---> applyTheme() ──> ThemedFrame (concrete colors)

```

### 1. Generate

Produce a candidate `EmotileExpression` using the JSON Schema or a template.

```typescript
import { MINIMAL_EXPRESSION } from "@yangyus8/emotile";

// Start from the minimal template and customize
const candidate = {
  ...MINIMAL_EXPRESSION,
  face: { shape: "circle", tilt: 2, squash: -0.05 },
  eyes: {
    left: { shape: "arc", x: 10, y: 12, size: 4, openness: 0.8 },
    right: { shape: "arc", x: 21, y: 12, size: 4, openness: 0.8 },
  },
  mouth: { shape: "smile", x: 16, y: 22, width: 6, curve: 0.3 },
};
```

### 2. Validate and Repair

```typescript
import { validateExpression, repairExpression } from "@yangyus8/emotile";

const validation = validateExpression(candidate);
if (!validation.ok) {
  console.warn("Validation errors:", validation.errors);
}

const repair = repairExpression(candidate);
if (repair.warnings.length > 0) {
  console.warn("Repair warnings:", repair.warnings);
}
const safeExpression = repair.value; // always valid
```

`repairExpression` is deterministic. It clamps ranges, fills missing fields, and replaces invalid enums with safe defaults.

### 3. Normalize

```typescript
import { normalizeExpression } from "@yangyus8/emotile";

const normalized = normalizeExpression(safeExpression);
```

Normalization fills in optional fields with defaults and ensures the expression is in canonical form before rendering.

### 4. Render

```typescript
import { renderExpression } from "@yangyus8/emotile";

const frame = renderExpression(normalized); // PixelFrame
```

`renderExpression` produces a `PixelFrame` — a pure-data 32×32 grid with semantic colors (`primary`, `accent`, `shadow`, `transparent`).

### 5. Theme and SVG (Optional)

`renderPixelFrameToSVG` accepts the semantic `PixelFrame` and maps colors internally using the `theme` option:

```typescript
import { normalizeTheme, renderPixelFrameToSVG } from "@yangyus8/emotile";

const theme = normalizeTheme({
  primary: "#1a1a2e",
  accent: "#e94560",
  shadow: "#533483",
});

const svg = renderPixelFrameToSVG(frame, {
  theme,
  pixelSize: 10,
  background: true,
});
```

If you need concrete pixel data instead of an SVG string, use `applyTheme`:

```typescript
import { applyTheme } from "@yangyus8/emotile";

const themedFrame = applyTheme(frame, { theme });
// themedFrame contains concrete hex colors per pixel
```

`renderPixelFrameToSVG` returns a plain SVG string. No browser, Canvas, GPU, or filesystem dependency is required.

## Complete TypeScript Example

```typescript
import {
  getExpressionSchema,
  validateExpression,
  repairExpression,
  normalizeExpression,
  renderExpression,
  normalizeTheme,
  applyTheme,
  renderPixelFrameToSVG,
  MINIMAL_EXPRESSION,
} from "@yangyus8/emotile";

function generateAndRender(candidate: unknown): string {
  // 1. Validate and repair
  const repair = repairExpression(candidate);
  if (repair.warnings.length > 0) {
    console.warn("Repaired expression:", repair.warnings);
  }

  // 2. Normalize
  const normalized = normalizeExpression(repair.value);

  // 3. Render to pixel frame
  const frame = renderExpression(normalized);

  // 4. Export to SVG with theme
  const theme = normalizeTheme();
  return renderPixelFrameToSVG(frame, { theme, pixelSize: 10 });
}

// Example usage
const svgString = generateAndRender({
  ...MINIMAL_EXPRESSION,
  face: { shape: "circle", tilt: 1, squash: 0 },
  mouth: { shape: "smile", x: 16, y: 22, width: 6, curve: 0.2 },
});
```

## Integration with Agent Hosts

This guide uses the Emotile package API directly. If you are integrating into an agent host such as OpenClaw or Hermes:

- Use the JSON Schema (`getExpressionSchema()`) as the structured-output constraint.
- Pipe the generated JSON through the validation / repair / normalize / render pipeline shown above.
- Pass the resulting SVG string to the host's display layer.

No runtime coupling is required. Emotile remains platform-independent.

## CLI Alternative

If your host environment prefers shell commands over JavaScript imports:

```bash
# Validate and repair a generated expression
emotile repair generated.json > safe.json

# Preview in ASCII
emotile preview safe.json

# Render to SVG
emotile render svg safe.json > output.svg
```

The CLI uses the same library code and produces the same deterministic output.

## References

- [Agent Guidance](/guide/agent-guidance) — safe ranges and common mistakes
- [Expression Schema](/guide/expression-schema) — full field reference
- [API Docs](/api/) — complete function signatures
