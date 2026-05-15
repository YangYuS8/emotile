// Emotile Agent Helpers — small deterministic utilities for AI agents

import type {
  EmotileExpression,
  EyeShape,
  MouthShape,
  FaceShape,
  MarkType,
  Motion,
  Mutation,
} from "./types";
import {
  DEFAULT_EXPRESSION,
  DEFAULT_EYE,
  DEFAULT_MOUTH,
  DEFAULT_FACE,
  DEFAULT_BROW,
  DEFAULT_MOTION,
  DEFAULT_MUTATION,
  EYE_SHAPES,
  MOUTH_SHAPES,
  FACE_SHAPES,
  MARK_TYPES,
  RANGE,
} from "./schema";

function clamp(min: number, max: number, v: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * Recommended generation constraints for AI agents producing Emotile
 * expressions. These values keep output inside validated ranges while
 * leaving enough expressive freedom.
 */
export const AGENT_GUIDANCE = {
  /** Prefer these eye shapes for clear readability */
  recommendedEyeShapes: ["dot", "line", "arc", "closed", "cross"] as const,

  /** Prefer these mouth shapes for clear readability */
  recommendedMouthShapes: ["flat", "smile", "sad", "open", "wave"] as const,

  /** Eye size that renders well at 32x32 */
  defaultEyeSize: 3,

  /** Mouth width that renders well at 32x32 */
  defaultMouthWidth: 6,

  /** Start from these positions for a neutral face */
  defaultLeftEye: { x: 10, y: 12 },
  defaultRightEye: { x: 21, y: 12 },
  defaultMouth: { x: 16, y: 22 },
  defaultBrowsY: 9,

  /** Safe ranges for agent generation (tighter than hard limits) */
  safeTilt: { min: -10, max: 10 },
  safeSquash: { min: -0.2, max: 0.2 },
  safeCurve: { min: -0.8, max: 0.8 },
  safeMarkIntensity: { min: 0.2, max: 1.0 },

  /** Motion values above these thresholds become very visible */
  strongMotionThreshold: 0.6,

  /** Maximum number of marks recommended for clarity */
  maxMarks: 3,
} as const;

/**
 * A minimal, valid expression that agents can use as a starting template.
 * All required fields are present; optional fields are omitted.
 */
export const MINIMAL_EXPRESSION: EmotileExpression = {
  version: "0.1",
  canvas: { width: 32, height: 32 },
  face: { shape: "none", tilt: 0, squash: 0 },
  eyes: {
    left: { shape: "dot", x: 10, y: 12, size: 3, openness: 1 },
    right: { shape: "dot", x: 21, y: 12, size: 3, openness: 1 },
  },
  mouth: { shape: "flat", x: 16, y: 22, width: 6, curve: 0 },
  motion: { blink: 0, jitter: 0, breath: 0, shake: 0, glitch: 0 },
  mutation: { asymmetry: 0, randomness: 0, glitch: 0 },
};

/**
 * Common mistakes agents make when generating expressions, paired with
 * how `repairExpression` fixes them. Use this to self-correct generation.
 */
export const COMMON_AGENT_MISTAKES = [
  {
    mistake: 'Using "wink" or "happy" as eye shape (not in enum)',
    repair: "Falls back to 'dot'",
    fix: "Use one of: " + EYE_SHAPES.join(", "),
  },
  {
    mistake: 'Using "grin" or "frown" as mouth shape (not in enum)',
    repair: "Falls back to 'flat'",
    fix: "Use one of: " + MOUTH_SHAPES.join(", "),
  },
  {
    mistake: "Placing eyes or mouth outside the 0-31 canvas range",
    repair: "Clamped to [0, 31]",
    fix: "Keep x and y between 0 and 31 inclusive",
  },
  {
    mistake:
      "Omitting required fields like version, canvas, face, eyes, or mouth",
    repair: "Filled with defaults",
    fix: "Always include version, canvas, face, eyes, and mouth",
  },
  {
    mistake: "Using out-of-range numeric values (e.g. tilt: 45, size: 20)",
    repair: "Clamped to valid range",
    fix: `Keep tilt in [${RANGE.faceTilt.min}, ${RANGE.faceTilt.max}], size in [${RANGE.eyeSize.min}, ${RANGE.eyeSize.max}]`,
  },
  {
    mistake: 'Forgetting to quote enum values or using uppercase ("Dot")',
    repair: "Falls back to default",
    fix: "Use lowercase exact enum strings",
  },
] as const;

/** Options for the `buildExpression` helper. */
export interface BuildExpressionOptions {
  /** Face shape override */
  faceShape?: FaceShape;
  /** Face tilt, clamped to [-15, 15] */
  tilt?: number;
  /** Eye shape for both eyes */
  eyeShape?: EyeShape;
  /** Mouth shape */
  mouthShape?: MouthShape;
  /** Mouth curve, clamped to [-1, 1] */
  curve?: number;
  /** Mark types to add (up to 3, default positions) */
  marks?: MarkType[];
  /** Motion settings (partial, defaults filled) */
  motion?: Partial<Motion>;
  /** Mutation settings (partial, defaults filled) */
  mutation?: Partial<Mutation>;
}

/**
 * Build a valid, normalized expression from high-level options.
 *
 * This is a small deterministic helper — same options always produce the
 * same expression. All values are clamped to safe ranges automatically.
 *
 * Example:
 * ```ts
 * const expr = buildExpression({
 *   eyeShape: "arc",
 *   mouthShape: "smile",
 *   curve: 0.5,
 *   marks: ["heart"],
 * });
 * ```
 */
const EYE_SHAPE_SET = new Set<string>(EYE_SHAPES);
const MOUTH_SHAPE_SET = new Set<string>(MOUTH_SHAPES);
const FACE_SHAPE_SET = new Set<string>(FACE_SHAPES);
const MARK_TYPE_SET = new Set<string>(MARK_TYPES);

function fallbackEnum(
  value: string | undefined,
  validSet: Set<string>,
  fallback: string,
): string {
  if (typeof value === "string" && validSet.has(value)) {
    return value;
  }
  return fallback;
}

export function buildExpression(
  options: BuildExpressionOptions = {},
): EmotileExpression {
  const eyeShape = fallbackEnum(options.eyeShape, EYE_SHAPE_SET, "dot");
  const mouthShape = fallbackEnum(options.mouthShape, MOUTH_SHAPE_SET, "flat");
  const faceShape = fallbackEnum(options.faceShape, FACE_SHAPE_SET, "none");

  const tilt = clamp(RANGE.faceTilt.min, RANGE.faceTilt.max, options.tilt ?? 0);
  const curve = clamp(
    RANGE.mouthCurve.min,
    RANGE.mouthCurve.max,
    options.curve ?? 0,
  );

  const marks: EmotileExpression["marks"] =
    options.marks && options.marks.length > 0
      ? options.marks
          .slice(0, AGENT_GUIDANCE.maxMarks)
          .filter((t): t is MarkType => MARK_TYPE_SET.has(t))
          .map((type, i) => ({
            type,
            x: clamp(0, 31, 6 + i * 10),
            y: 8,
            intensity: 0.7,
          }))
      : undefined;

  const motion: Motion = {
    blink: clamp(0, 1, options.motion?.blink ?? 0),
    jitter: clamp(0, 1, options.motion?.jitter ?? 0),
    breath: clamp(0, 1, options.motion?.breath ?? 0),
    shake: clamp(0, 1, options.motion?.shake ?? 0),
    glitch: clamp(0, 1, options.motion?.glitch ?? 0),
  };

  const mutation: Mutation = {
    asymmetry: clamp(0, 1, options.mutation?.asymmetry ?? 0),
    randomness: clamp(0, 1, options.mutation?.randomness ?? 0),
    glitch: clamp(0, 1, options.mutation?.glitch ?? 0),
  };

  return {
    version: "0.1",
    canvas: { width: 32, height: 32 },
    face: { shape: faceShape as FaceShape, tilt, squash: 0 },
    eyes: {
      left: { ...DEFAULT_EYE, x: 10, y: 12, shape: eyeShape as EyeShape },
      right: { ...DEFAULT_EYE, x: 21, y: 12, shape: eyeShape as EyeShape },
    },
    mouth: {
      shape: mouthShape as MouthShape,
      x: 16,
      y: 22,
      width: 6,
      curve,
    },
    ...(marks && marks.length > 0 ? { marks } : {}),
    motion,
    mutation,
  };
}
