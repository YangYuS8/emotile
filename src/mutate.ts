// Emotile v0.1 Mutator — deterministic, seed-based expression mutation

import type {
  EmotileExpression,
  Eye,
  Mouth,
  Brow,
  MutateOptions,
} from "./types";

// Simple deterministic PRNG (mulberry32)
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed: string | number): number {
  if (typeof seed === "number") return seed | 0;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return h;
}

function clamp(min: number, max: number, v: number): number {
  return Math.min(max, Math.max(min, v));
}

function mutateEye(eye: Eye, rng: () => number, amount: number): Eye {
  const mutation = eye.openness * 0; // placeholder to use expression.mutation if needed
  const posJitter = amount * 1.5;
  const sizeJitter = amount * 0.5;
  const openJitter = amount * 0.1;

  return {
    ...eye,
    x: Math.round(clamp(0, 31, eye.x + (rng() - 0.5) * posJitter)),
    y: Math.round(clamp(0, 31, eye.y + (rng() - 0.5) * posJitter)),
    size: Math.round(clamp(1, 8, eye.size + (rng() - 0.5) * sizeJitter)),
    openness: clamp(0, 1, eye.openness + (rng() - 0.5) * openJitter),
  };
}

function mutateMouth(mouth: Mouth, rng: () => number, amount: number): Mouth {
  const curveJitter = amount * 0.15;
  const posJitter = amount * 0.8;
  const widthJitter = amount * 0.5;

  return {
    ...mouth,
    x: Math.round(clamp(0, 31, mouth.x + (rng() - 0.5) * posJitter)),
    y: Math.round(clamp(0, 31, mouth.y + (rng() - 0.5) * posJitter)),
    width: Math.round(clamp(1, 16, mouth.width + (rng() - 0.5) * widthJitter)),
    curve: clamp(-1, 1, mouth.curve + (rng() - 0.5) * curveJitter),
  };
}

function mutateBrow(brow: Brow, rng: () => number, amount: number): Brow {
  const angleJitter = amount * 8;

  return {
    ...brow,
    angle: clamp(-90, 90, brow.angle + (rng() - 0.5) * angleJitter),
    y: Math.round(clamp(0, 31, brow.y + (rng() - 0.5) * amount * 0.8)),
  };
}

export function mutateExpression(
  expression: EmotileExpression,
  options: MutateOptions = {}
): EmotileExpression {
  const seed = options.seed ?? Date.now();
  const amount = options.amount ?? 0.3;
  const rng = mulberry32(hashSeed(seed));

  const eyes = {
    left: mutateEye(expression.eyes.left, rng, amount),
    right: mutateEye(expression.eyes.right, rng, amount),
  };

  const mouth = mutateMouth(expression.mouth, rng, amount);

  const brows = expression.brows
    ? {
        left: expression.brows.left
          ? mutateBrow(expression.brows.left, rng, amount)
          : undefined,
        right: expression.brows.right
          ? mutateBrow(expression.brows.right, rng, amount)
          : undefined,
      }
    : undefined;

  const marks = expression.marks
    ? expression.marks.map((mark) => ({
        ...mark,
        x: Math.round(clamp(0, 31, mark.x + (rng() - 0.5) * amount * 1.5)),
        y: Math.round(clamp(0, 31, mark.y + (rng() - 0.5) * amount * 1.5)),
        intensity: clamp(0, 1, mark.intensity + (rng() - 0.5) * amount * 0.2),
      }))
    : undefined;

  // face tilt jitter
  const face = {
    ...expression.face,
    tilt: clamp(-15, 15, expression.face.tilt + (rng() - 0.5) * amount * 3),
  };

  return {
    ...expression,
    face,
    eyes,
    mouth,
    ...(brows ? { brows } : {}),
    ...(marks ? { marks } : {}),
  };
}
