# Emotile Theme and Palette Support — Design Proposal

> **Status:** Design-only proposal for v0.2. No runtime implementation in this issue.  
> **Scope:** Compare design options, define semantic color mapping, assess impact, recommend timeline.

---

## 1. Problem Statement

v0.1 uses four hard-coded semantic colors:

| Semantic name | Current meaning |
|---------------|-----------------|
| `transparent` | No pixel |
| `primary`     | Main face lines |
| `accent`      | Highlights, marks |
| `shadow`      | Depth, secondary details |

These are abstract on purpose — the renderer outputs pure data and leaves color-to-pixel conversion to downstream consumers. However, as more integrations appear (terminal, Godot, web), each consumer redefines its own palette. A standardized theme system would let agents specify a color mood once and have it respected everywhere.

---

## 2. Design Options Compared

### Option A: Separate Palette Input (external to expression)

A `Theme` object is passed alongside the expression at render time.

```ts
interface Theme {
  primary: string;  // e.g. "#3b82f6"
  accent: string;   // e.g. "#f59e0b"
  shadow: string;   // e.g. "#1f2937"
  background?: string; // e.g. "#ffffff"
}

renderExpression(expression, { theme });
```

**Pros**
- Expression stays small and portable.
- One expression can be rendered with many themes without mutation.
- Easy for agents to ignore if they do not care about color.
- Backward compatible: omitting theme keeps current semantic behavior.

**Cons**
- Consumers that only receive a `PixelFrame` lose theme info unless it is embedded in the frame.
- Requires API signature change in `renderExpression`.
- Two pieces of data (expression + theme) must travel together.

### Option B: Expression-Embedded Palette (inside expression schema)

The expression itself carries a `theme` field.

```json
{
  "version": "0.2",
  "theme": {
    "primary": "#3b82f6",
    "accent": "#f59e0b",
    "shadow": "#1f2937"
  },
  "face": { ... }
}
```

**Pros**
- Self-contained: one JSON object carries everything.
- Theme can be validated, repaired, and normalized just like other fields.
- Agents can generate mood-specific expressions in a single shot.

**Cons**
- Increases expression size and complexity.
- Changing theme requires mutating the expression.
- Version bump required (0.1 → 0.2) because it changes the schema.
- Agents may generate invalid hex codes; repair surface expands.

---

## 3. Semantic-to-Concrete Mapping

Regardless of which option is chosen, the semantic names stay the same. The mapping table should be:

| Semantic | Default (fallback) | Role |
|----------|-------------------|------|
| `primary` | `#000000` | Eyes, mouth outline, brows — the main face structure |
| `accent` | `#ff8800` | Highlights, sparkle, heart, sweat — attention-grabbing marks |
| `shadow` | `#555555` | Smoke, ellipsis, anger vein secondary lines — depth |
| `background` | `#ffffff` | Optional canvas background for consumers that fill it |

Consumers are free to map these to terminal ANSI codes, Godot modulate colors, web CSS, or any other concrete representation.

---

## 4. Impact Analysis

### Validation impact
- **Option A:** None on expression schema. New `validateTheme(theme)` helper if desired.
- **Option B:** Add `theme` as optional object; validate hex string format. Adds ~20 lines to validator.

### Normalization impact
- **Option A:** None.
- **Option B:** Fill missing theme keys with defaults; clamp/ignore invalid hex strings.

### Repair impact
- **Option A:** None on expression repair. Theme repair is a separate concern.
- **Option B:** Invalid hex strings fall back to defaults; report warnings.

### Renderer impact
- **Option A:** `renderExpression` accepts optional `theme`; each `Pixel` gains a concrete color field, or a separate `colorMap` is returned.
- **Option B:** Renderer reads `expression.theme` and maps semantic colors before output.

### Documentation impact
- Both options require README and spec updates.
- Option B also requires a version bump in all examples.

### Tests impact
- Option A: new tests for theme mapping, default fallback.
- Option B: new tests for theme validation, normalization, repair.

---

## 5. Recommendation

**Defer expression-embedded palette to v0.3 or later, and implement Option A (separate palette input) in v0.2.**

Rationale:
1. The v0.2 roadmap (#25) already includes animation tick, which is a larger behavioral change. Adding a schema bump simultaneously increases review risk.
2. Option A keeps expressions portable and backward compatible, which aligns with the v0.1 "pure data, no platform dependency" principle.
3. Most agents generating expressions today do not care about exact hex colors; they care about semantic structure. A separate palette input lets downstream consumers (terminal apps, web previews, game engines) own color without forcing agents to learn hex syntax.
4. If real-world usage shows that agents *want* to embed colors, we can promote the separate theme object into the expression schema in v0.3 with concrete data.

### Suggested v0.2 path
- Add an optional `Theme` type and `renderExpression(expr, { theme? })` overload.
- Default behavior unchanged (semantic colors only).
- Document the mapping table in README and spec.
- No schema version bump.

### Suggested v0.3 follow-up
- Re-evaluate whether to embed `theme` into the expression based on agent feedback.
- If embedded, bump version to `0.3` and update all validation/repair paths.

---

## 6. Open Questions for Architect

1. Should the `PixelFrame` output gain a `theme` field, or should theme mapping happen in a separate `applyTheme(frame, theme)` step?
2. Should we support named preset themes (e.g. `"dark"`, `"pastel"`) in addition to explicit hex values?
3. Does the Godot integration target prefer Option A or B based on its resource pipeline?
