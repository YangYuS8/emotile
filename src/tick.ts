// Emotile v0.2 Animation Tick — deterministic pure-data motion application
//
// This module applies motion fields to an expression using an explicit tick
// counter. It is fully deterministic: the same expression + tick always
// produces the same output. No timers, no browser APIs, no Canvas.

import type {
  EmotileExpression,
  EyeShape,
  MouthShape,
} from "./types";

// Reuse the deterministic PRNG from mutate.ts
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(min: number, max: number, v: number): number {
  return Math.min(max, Math.max(min, v));
}

const EYE_SHAPES: readonly EyeShape[] = [
  "dot",
  "line",
  "arc",
  "closed",
  "cross",
  "star",
  "hollow",
  "spiral",
];

const MOUTH_SHAPES: readonly MouthShape[] = [
  "flat",
  "smile",
  "sad",
  "open",
  "wave",
  "broken",
  "tiny_o",
  "hidden",
];

/**
 * Apply motion fields to an expression for a given animation tick.
 *
 * This is a **pure function**: same `expression` + `tick` always returns the
 * same result. No timers, no side effects, no platform dependencies.
 *
 * The returned expression can be fed directly into `renderExpression`.
 *
 * Motion fields (all 0–1):
 * - `blink`  — periodic eye closure. Higher = more frequent / longer blinks.
 * - `breath` — periodic squash and vertical shift using a sine wave.
 * - `shake`  — periodic horizontal/vertical offset using sine/cosine.
 * - `jitter` — deterministic random micro-movements each tick.
 * - `glitch` — occasional deterministic random shape swaps.
 *
 * @param expression — a valid EmotileExpression (should be normalized)
 * @param tick — non-negative integer frame / time step
 * @returns a new EmotileExpression with motion applied
 */
export function tickExpression(
  expression: EmotileExpression,
  tick: number,
): EmotileExpression {
  if (!Number.isFinite(tick) || tick < 0) {
    // Invalid tick is treated as 0 — never throw
    tick = 0;
  }
  const t = Math.floor(tick);

  const motion = expression.motion ?? {
    blink: 0,
    jitter: 0,
    breath: 0,
    shake: 0,
    glitch: 0,
  };

  // Deterministic RNG seeded by tick for jitter / glitch
  const rng = mulberry32(t * 0x9e3779b9);

  let result: EmotileExpression = { ...expression };

  // --- Blink ---
  // Period shortens as blink intensity increases (20 frames down to ~2).
  // Eyes close for a brief duration, then reopen.
  if (motion.blink > 0) {
    const period = Math.max(2, Math.round(20 - motion.blink * 17));
    const phase = t % period;
    const closeDuration = Math.max(1, Math.round(motion.blink * 3));
    if (phase < closeDuration) {
      // Closed phase: linearly reopen toward the end
      const reopenFactor = phase / closeDuration; // 0 → 1
      const targetOpenness = clamp(0, 1, reopenFactor * (1 - motion.blink * 0.3));
      result = {
        ...result,
        eyes: {
          left: { ...result.eyes.left, openness: targetOpenness },
          right: { ...result.eyes.right, openness: targetOpenness },
        },
      };
    }
  }

  // --- Breath ---
  // Gentle sine wave affects face squash and mouth vertical position.
  if (motion.breath > 0) {
    const cycle = Math.sin(t * 0.15) * motion.breath;
    result = {
      ...result,
      face: {
        ...result.face,
        squash: clamp(-0.3, 0.3, result.face.squash + cycle * 0.15),
      },
      mouth: {
        ...result.mouth,
        y: clamp(0, 31, Math.round(result.mouth.y + cycle * 1.5)),
      },
    };
  }

  // --- Shake ---
  // Sine-driven offset applied to eyes and mouth.
  if (motion.shake > 0) {
    const offsetX = Math.round(Math.sin(t * 0.8) * motion.shake * 2);
    const offsetY = Math.round(Math.cos(t * 0.6) * motion.shake * 2);
    result = {
      ...result,
      eyes: {
        left: {
          ...result.eyes.left,
          x: clamp(0, 31, result.eyes.left.x + offsetX),
          y: clamp(0, 31, result.eyes.left.y + offsetY),
        },
        right: {
          ...result.eyes.right,
          x: clamp(0, 31, result.eyes.right.x + offsetX),
          y: clamp(0, 31, result.eyes.right.y + offsetY),
        },
      },
      mouth: {
        ...result.mouth,
        x: clamp(0, 31, result.mouth.x + offsetX),
        y: clamp(0, 31, result.mouth.y + offsetY),
      },
    };
  }

  // --- Jitter ---
  // Deterministic random micro-movements on eyes and mouth.
  if (motion.jitter > 0) {
    const amount = motion.jitter * 1.5;
    result = {
      ...result,
      eyes: {
        left: {
          ...result.eyes.left,
          x: clamp(
            0,
            31,
            Math.round(result.eyes.left.x + (rng() - 0.5) * amount),
          ),
          y: clamp(
            0,
            31,
            Math.round(result.eyes.left.y + (rng() - 0.5) * amount),
          ),
        },
        right: {
          ...result.eyes.right,
          x: clamp(
            0,
            31,
            Math.round(result.eyes.right.x + (rng() - 0.5) * amount),
          ),
          y: clamp(
            0,
            31,
            Math.round(result.eyes.right.y + (rng() - 0.5) * amount),
          ),
        },
      },
      mouth: {
        ...result.mouth,
        x: clamp(
          0,
          31,
          Math.round(result.mouth.x + (rng() - 0.5) * amount),
        ),
        y: clamp(
          0,
          31,
          Math.round(result.mouth.y + (rng() - 0.5) * amount),
        ),
      },
    };
  }

  // --- Glitch ---
  // Occasional deterministic random shape swap.
  if (motion.glitch > 0 && rng() < motion.glitch * 0.3) {
    result = {
      ...result,
      eyes: {
        left: {
          ...result.eyes.left,
          shape: EYE_SHAPES[Math.floor(rng() * EYE_SHAPES.length)],
        },
        right: {
          ...result.eyes.right,
          shape: EYE_SHAPES[Math.floor(rng() * EYE_SHAPES.length)],
        },
      },
      mouth: {
        ...result.mouth,
        shape: MOUTH_SHAPES[Math.floor(rng() * MOUTH_SHAPES.length)],
      },
    };
  }

  return result;
}
