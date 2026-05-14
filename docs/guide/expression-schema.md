# Expression Schema

An Emotile expression is a JSON object with the following structure:

## Top-Level Fields

| Field    | Required | Description                          |
|----------|----------|--------------------------------------|
| version  | yes      | Must be `"0.1"`                      |
| canvas   | yes      | Fixed 32×32 in v0.1                 |
| face     | yes      | Shape, tilt, squash                 |
| eyes     | yes      | Left and right eye definitions       |
| mouth    | yes      | Mouth shape and position             |
| brows    | no       | Left and right eyebrow definitions   |
| marks    | no       | Array of decorative symbols          |
| motion   | no       | Animation parameters                 |
| mutation | no       | Mutation / variation parameters      |

## Canvas

v0.1 uses a **fixed 32×32 canvas**. The `canvas` field is required for forward compatibility, but `width` and `height` must both be `32`.

## Face

| Field  | Type   | Default  | Values                    |
|--------|--------|----------|---------------------------|
| shape  | string | `"none"` | `"none"`, `"circle"`, `"soft_square"` |
| tilt   | number | 0        | -15 to 15                 |
| squash | number | 0        | -0.3 to 0.3               |

## Eyes

Each eye has:

| Field     | Type   | Default | Range / Values                                      |
|-----------|--------|---------|-----------------------------------------------------|
| shape     | string | `"dot"` | `"dot"`, `"line"`, `"arc"`, `"closed"`, `"cross"`, `"star"`, `"hollow"`, `"spiral"` |
| x         | number | —       | 0–31                                                |
| y         | number | —       | 0–31                                                |
| size      | number | 3       | 1–8                                                 |
| openness  | number | 1       | 0–1                                                 |
| angle     | number | —       | -180 to 180 (optional)                              |

## Mouth

| Field | Type   | Default   | Range / Values                                      |
|-------|--------|-----------|-----------------------------------------------------|
| shape | string | `"flat"`  | `"flat"`, `"smile"`, `"sad"`, `"open"`, `"wave"`, `"broken"`, `"tiny_o"`, `"hidden"` |
| x     | number | 16        | 0–31                                                |
| y     | number | 22        | 0–31                                                |
| width | number | 6         | 1–16                                                |
| curve | number | 0         | -1 to 1                                             |

## Marks

| Field     | Type   | Default | Range / Values                                      |
|-----------|--------|---------|-----------------------------------------------------|
| type      | string | —       | `"sweat"`, `"question"`, `"exclamation"`, `"heart"`, `"sparkle"`, `"smoke"`, `"anger"`, `"ellipsis"` |
| x         | number | —       | 0–31                                                |
| y         | number | —       | 0–31                                                |
| intensity | number | —       | 0–1                                                 |

## Motion & Mutation

Both are optional objects with numeric fields in range 0–1:

- **Motion:** `blink`, `jitter`, `breath`, `shake`, `glitch`
- **Mutation:** `asymmetry`, `randomness`, `glitch`
