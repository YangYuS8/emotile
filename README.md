# Emotile

Emotile is a pixel expression language and runtime for AI agents.

Instead of choosing from predefined emoji, stickers, or Live2D motions, an agent can describe a pixel-based facial expression using structured primitives such as eyes, mouth, brows, marks, motion, and mutation.

The runtime validates, repairs, normalizes, and renders the expression into a tiny pixel face.

[中文文档](README.zh-CN.md) | [Documentation Site](https://yangyus8.github.io/emotile/)

## Why Not Predefined Emoji Packs?

Predefined expressions like `happy_01` or `sad_02` create a fixed catalog. An agent can only express what the catalog contains. Visual primitives are composable — an agent can express "proud but slightly worried" or "confused but trying" without anyone having pre-drawn that exact expression.

## Why Not Let Agents Control Individual Pixels?

Direct pixel control makes validation impossible, produces unrecognizable faces from small errors, and removes the structural guarantees that let animation, scaling, and theming work. Emotile's constrained grammar gives agents enough flexibility while ensuring output is always structurally valid.

## Current Stage

**v0.2** — animation tick API, agent helpers, and generation guidance. Validates, normalizes, repairs, renders, mutates, and animates expressions as pure data. No browser, canvas, or GPU dependency.

## Minimal Expression Example

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "smile", "x": 16, "y": 22, "width": 6, "curve": 0.4 },
  "motion": { "blink": 0, "jitter": 0, "breath": 0, "shake": 0, "glitch": 0 },
  "mutation": { "asymmetry": 0, "randomness": 0, "glitch": 0 }
}
```

## API

```ts
import {
  validateExpression,
  normalizeExpression,
  repairExpression,
  renderExpression,
  mutateExpression,
  tickExpression,
  buildExpression,
} from "@yangyus8/emotile";

// Validate — check if an expression is structurally valid
const result = validateExpression(input);
if (result.ok) {
  console.log("Valid!", result.value);
} else {
  console.log("Errors:", result.errors);
}

// Normalize — fill defaults, clamp values, always succeeds
const normalized = normalizeExpression(input);

// Repair — fix invalid shapes, clamp values, report warnings
const { value, warnings } = repairExpression(input);

// Render — produce a pixel frame (pure data, no canvas dependency)
const frame = renderExpression(normalized);
console.log(`${frame.width}x${frame.height}, ${frame.pixels.length} pixels`);

// Mutate — deterministic, seed-based variation
const mutated = mutateExpression(normalized, { seed: 42, amount: 0.2 });

// Animation tick — apply motion fields deterministically using explicit tick
const ticked = tickExpression(normalized, 5);
const animatedFrame = renderExpression(ticked);

// Agent helper — build a valid expression from high-level options
const expr = buildExpression({ eyeShape: "arc", mouthShape: "smile", curve: 0.5 });
```

## Debug Preview

```ts
import { renderPixelFrameToASCII } from "@yangyus8/emotile";

const ascii = renderPixelFrameToASCII(frame);
console.log(ascii);
```

Characters map to pixel colors:
- `#` = primary
- `@` = accent
- `-` = shadow
- ` ` = transparent

## Run Tests

```bash
pnpm install
pnpm test
```

## Render Examples

```ts
import { normalizeExpression, renderExpression } from "@yangyus8/emotile";
import confused from "./examples/confused.json";

const normalized = normalizeExpression(confused);
const frame = renderExpression(normalized);

frame.pixels.forEach((p) => {
  console.log(`(${p.x}, ${p.y}) = ${p.color}`);
});
```

## Agent Guidance

When generating expressions, AI agents should follow these constraints to minimize repairs:

- Use only valid enum values. Eye shapes: `dot`, `line`, `arc`, `closed`, `cross`, `star`, `hollow`, `spiral`. Mouth shapes: `flat`, `smile`, `sad`, `open`, `wave`, `broken`, `tiny_o`, `hidden`.
- Keep all coordinates inside `0` to `31`.
- Keep `face.tilt` between `-15` and `15`, `mouth.curve` between `-1` and `1`.
- Always include required fields: `version`, `canvas`, `face`, `eyes`, `mouth`.
- Start from `buildExpression()` or `MINIMAL_EXPRESSION` rather than writing JSON from scratch.

Common mistakes and their automatic repairs:

| Mistake | Repair |
|---------|--------|
| Invalid eye/mouth shape | Falls back to `dot` / `flat` |
| Out-of-range coordinates | Clamped to `[0, 31]` |
| Missing required fields | Filled with defaults |
| Out-of-range numbers | Clamped to valid range |

## Current Limitations

- v0.1 canvas is fixed at 32×32.
- Renderer produces a pixel list, not PNG/GIF/SVG — downstream consumers must convert.
- Motion fields are animated via explicit `tickExpression` — there is no built-in timer or loop.
- No theme / color palette support yet (colors are semantic: `primary`, `accent`, `shadow`).
- No browser, terminal, or game engine integration yet.

## Roadmap

- **v0.2** (current): Animation tick API, agent helpers and generation guidance, theme/palette design proposal.
- **v0.3**: Theme/palette runtime support, terminal renderer (braille/unicode), Godot integration.
- **v0.4**: PNG/SVG export, agent-friendly prompt schema, OpenClaw/Hermes integration hooks.
- **v1.0**: Stable spec, full animation runtime.

## License

MIT
