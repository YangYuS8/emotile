# Emotile v0.1 Specification

## 1. Design Goals

Emotile is a **pixel expression language and runtime for AI agents**. Its primary goals are:

- Provide a **structured, constrained visual grammar** for pixel-based facial expressions.
- Allow AI agents to **generate** their own expressions using primitives (eyes, mouth, brows, marks, motion, mutation) rather than choosing from a predefined catalog.
- Ensure that any agent output can be **validated, repaired, normalized, and rendered** without human intervention.
- Keep the runtime **platform-independent** — no browser, canvas, or GPU dependency.

## 2. Non-Goals

- Emotile is **not** a complete desktop pet / avatar application.
- Emotile is **not** a Live2D replacement.
- Emotile does **not** generate PNG/GIF images directly (that is a future renderer concern).
- Emotile does **not** provide a UI or window manager.
- Emotile does **not** depend on image generation models.

## 3. Expression Top-Level Structure

An Emotile expression is a JSON object with the following fields:

| Field     | Required | Description                          |
|-----------|----------|--------------------------------------|
| version   | yes      | Must be `"0.1"`                      |
| canvas    | yes      | Pixel grid dimensions               |
| face      | yes      | Face shape, tilt, squash            |
| eyes      | yes      | Left and right eye definitions       |
| mouth     | yes      | Mouth shape and position             |
| brows     | no       | Left and right eyebrow definitions   |
| marks     | no       | Array of decorative symbols          |
| motion    | no       | Animation parameters                 |
| mutation  | no       | Mutation / variation parameters      |

## 4. Field Specifications

### 4.1 version

- Type: `"0.1"` (string literal)
- Required: yes

### 4.2 canvas

v0.1 uses a **fixed 32×32 canvas**. The `canvas` field is required for forward compatibility, but `width` and `height` must both be `32`. Values other than `32` are treated as invalid by the validator and clamped to `32` by the normalizer and repair modules.

### 4.3 face

| Field   | Type   | Default   | Range         |
|---------|--------|-----------|---------------|
| shape   | string | `"none"`  | `"none"`, `"circle"`, `"soft_square"` |
| tilt    | number | 0         | -15 to 15     |
| squash  | number | 0         | -0.3 to 0.3   |

### 4.4 eyes

Contains `left` and `right`, each an eye object:

| Field     | Type   | Default | Range         |
|-----------|--------|---------|---------------|
| shape     | string | `"dot"` | `"dot"`, `"line"`, `"arc"`, `"closed"`, `"cross"`, `"star"`, `"hollow"`, `"spiral"` |
| x         | number | —       | 0–31          |
| y         | number | —       | 0–31          |
| size      | number | 3       | 1–8           |
| openness  | number | 1       | 0–1           |
| angle     | number | —       | -180 to 180 (optional) |

### 4.5 mouth

| Field  | Type   | Default   | Range/Values                                                               |
|--------|--------|-----------|----------------------------------------------------------------------------|
| shape  | string | `"flat"`  | `"flat"`, `"smile"`, `"sad"`, `"open"`, `"wave"`, `"broken"`, `"tiny_o"`, `"hidden"` |
| x      | number | 16        | 0–31                                                                       |
| y      | number | 22        | 0–31                                                                       |
| width  | number | 6         | 1–16                                                                       |
| curve  | number | 0         | -1 to 1                                                                    |

### 4.6 brows (optional)

Contains optional `left` and `right`, each a brow object:

| Field  | Type   | Default | Range       |
|--------|--------|---------|-------------|
| angle  | number | 0       | -90 to 90   |
| y      | number | 9       | 0–31        |
| length | number | 4       | 1–8         |

### 4.7 marks (optional array)

Each mark:

| Field     | Type   | Default | Range/Values                                                              |
|-----------|--------|---------|---------------------------------------------------------------------------|
| type      | string | —       | `"sweat"`, `"question"`, `"exclamation"`, `"heart"`, `"sparkle"`, `"smoke"`, `"anger"`, `"ellipsis"` |
| x         | number | —       | 0–31                                                                      |
| y         | number | —       | 0–31                                                                      |
| intensity | number | —       | 0–1                                                                       |

### 4.8 motion (optional)

| Field  | Type   | Default | Range |
|--------|--------|---------|-------|
| blink  | number | 0       | 0–1   |
| jitter | number | 0       | 0–1   |
| breath | number | 0       | 0–1   |
| shake  | number | 0       | 0–1   |
| glitch | number | 0       | 0–1   |

### 4.9 mutation (optional)

| Field      | Type   | Default | Range |
|------------|--------|---------|-------|
| asymmetry  | number | 0       | 0–1   |
| randomness | number | 0       | 0–1   |
| glitch     | number | 0       | 0–1   |

## 5. Default Values

When fields are missing, the following defaults apply:

- `canvas`: `{ width: 32, height: 32 }`
- `face`: `{ shape: "none", tilt: 0, squash: 0 }`
- `eyes.left`: `{ shape: "dot", x: 10, y: 12, size: 3, openness: 1 }`
- `eyes.right`: `{ shape: "dot", x: 21, y: 12, size: 3, openness: 1 }`
- `mouth`: `{ shape: "flat", x: 16, y: 22, width: 6, curve: 0 }`
- `brows`: omitted
- `marks`: omitted
- `motion`: `{ blink: 0, jitter: 0, breath: 0, shake: 0, glitch: 0 }`
- `mutation`: `{ asymmetry: 0, randomness: 0, glitch: 0 }`

## 6. Validator Behavior

`validateExpression(input)`:

1. Checks `version` is exactly `"0.1"`.
2. Checks all required fields exist and have correct types.
3. Checks all enum fields are valid values.
4. Checks all numeric fields are within range.
5. Returns `{ ok: true, value, errors: [] }` if valid.
6. Returns `{ ok: false, errors }` if invalid, with a `path` and `message` for each error.

## 7. Normalizer Behavior

`normalizeExpression(input)`:

1. Fills in missing `canvas` with defaults.
2. Fills in missing `face` with defaults.
3. Fills in missing `eyes` (left/right) with defaults.
4. Fills in missing `mouth` with defaults.
5. Clamps all numeric values to their valid ranges.
6. Fills in `motion` and `mutation` with defaults if missing.
7. Returns a complete, valid `EmotileExpression`.

The normalizer always succeeds — it never throws. It is meant to make any input safe for the renderer.

## 8. Repair Behavior

`repairExpression(input)`:

1. Falls back invalid `face.shape` to `"none"`.
2. Falls back invalid `eye.shape` to `"dot"`.
3. Falls back invalid `mouth.shape` to `"flat"`.
4. Falls back invalid `mark.type` to `"sweat"`.
5. Clamps out-of-range numeric values.
6. Fills in missing required fields with defaults.
7. Returns `{ value, warnings }` where `warnings` lists every repair made.

Repair is designed for inputs from LLMs / agents that may produce partially invalid expressions.

## 9. Renderer Behavior

`renderExpression(expression)`:

1. Takes a **normalized** expression (output of `normalizeExpression` or `repairExpression`).
2. Produces a `PixelFrame` — a pure data structure with `width`, `height`, and `pixels[]`.
3. Each pixel has `x`, `y`, and `color` (`"transparent"`, `"primary"`, `"accent"`, `"shadow"`).
4. No browser, canvas, or GPU dependency.
5. v0.1 supports: dot, line, arc, closed, cross, star, hollow, spiral eyes; all 8 mouth shapes; all 8 mark types.
6. Pixels outside canvas bounds are clipped.
7. When multiple primitives emit pixels at the same coordinate, the renderer uses **last-write-wins**: the last primitive rendered at that coordinate determines the final color. The render order is eyes → mouth → brows → marks.

## 10. Why Visual Primitives, Not Predefined Expressions

Predefined expressions like `happy_01` or `sad_02` create a fixed catalog. An agent can only express what the catalog contains. If the agent's emotional state doesn't map to an existing preset, it must choose the closest match — losing nuance.

Visual primitives (eyes, mouth, brows, marks) are composable. An agent can express "proud but slightly worried" or "confused but trying" by combining primitives — without anyone having pre-drawn that exact expression.

Primitives also make validation and repair tractable: each field has a known type and range, so broken output can be fixed field-by-field.

## 11. Why Not Let Agents Control Individual Pixels

Giving an agent direct pixel-level control would:

- Make validation nearly impossible (any 32×32 grid is "valid").
- Produce unrecognizable faces when the agent makes small errors.
- Remove the structural guarantees that let other systems (animation, scaling, theming) work reliably.
- Eliminate the repair pathway — you can't meaningfully "fix" an arbitrary pixel matrix.

Emotile's constrained grammar is the right tradeoff: agents get enough flexibility to express nuanced states, but the output is always structurally valid and renderable.
