# Agent Guidance

This guide helps AI agents generate valid, expressive Emotile expressions.

## Minimal Valid Expression

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "flat", "x": 16, "y": 22, "width": 6, "curve": 0 },
  "motion": { "blink": 0, "jitter": 0, "breath": 0, "shake": 0, "glitch": 0 },
  "mutation": { "asymmetry": 0, "randomness": 0, "glitch": 0 }
}
```

## Common Repairable Mistakes

- Invalid eye/mouth shapes → repaired to `"dot"` / `"flat"`
- Out-of-range values → clamped to valid range
- Missing fields → filled with defaults
- Non-object marks array elements → filtered out

## Recommended Generation Constraints

- Keep `tilt` small (-5 to 5) for subtle expressions
- Use `curve` between -0.5 and 0.5 for natural mouth shapes
- `openness` < 0.3 creates sleepy/closed eyes
- Add 1–2 marks maximum to avoid clutter

## Workflow

1. **Generate** an expression object
2. **Validate** with `validateExpression()`
3. If invalid, **repair** with `repairExpression()`
4. **Normalize** with `normalizeExpression()` before rendering
5. **Render** with `renderExpression()`

## Deterministic Mutation

Use `mutateExpression(expression, { seed, amount })` for controlled variation:
- `seed` ensures reproducible output
- `amount` controls variation intensity (0–1)
