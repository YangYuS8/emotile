// Emotile v0.1 Normalizer

import type {
  EmotileExpression,
  Eye,
  Brow,
  Motion,
  Mutation,
  FaceShape,
  MouthShape,
  MarkType,
  EyeShape,
} from "./types";
import {
  DEFAULT_CANVAS,
  DEFAULT_FACE,
  DEFAULT_EYES,
  DEFAULT_MOUTH,
  DEFAULT_BROWS,
  DEFAULT_MOTION,
  DEFAULT_MUTATION,
  RANGE,
  FACE_SHAPES,
  EYE_SHAPES,
  MOUTH_SHAPES,
  MARK_TYPES,
} from "./schema";

const FACE_SHAPE_SET = new Set<string>(FACE_SHAPES);
const EYE_SHAPE_SET = new Set<string>(EYE_SHAPES);
const MOUTH_SHAPE_SET = new Set<string>(MOUTH_SHAPES);
const MARK_TYPE_SET = new Set<string>(MARK_TYPES);

function clamp(min: number, max: number, v: number): number {
  return Math.min(max, Math.max(min, v));
}

function normalizeEye(
  eye: Partial<Eye> & Record<string, unknown>,
  fallback: Eye,
): Eye {
  const rawShape = typeof eye.shape === "string" ? eye.shape : fallback.shape;
  const shape = (
    EYE_SHAPE_SET.has(rawShape) ? rawShape : fallback.shape
  ) as EyeShape;
  return {
    shape,
    x: typeof eye.x === "number" ? Math.round(clamp(0, 31, eye.x)) : fallback.x,
    y: typeof eye.y === "number" ? Math.round(clamp(0, 31, eye.y)) : fallback.y,
    size:
      typeof eye.size === "number"
        ? Math.round(clamp(RANGE.eyeSize.min, RANGE.eyeSize.max, eye.size))
        : fallback.size,
    openness:
      typeof eye.openness === "number"
        ? clamp(RANGE.eyeOpenness.min, RANGE.eyeOpenness.max, eye.openness)
        : fallback.openness,
    ...(typeof eye.angle === "number"
      ? { angle: eye.angle }
      : fallback.angle !== undefined
        ? { angle: fallback.angle }
        : {}),
  };
}

function normalizeBrow(
  brow: Partial<Brow> & Record<string, unknown>,
  fallback: Brow,
): Brow {
  return {
    angle:
      typeof brow.angle === "number"
        ? clamp(-90, 90, brow.angle)
        : fallback.angle,
    y:
      typeof brow.y === "number"
        ? Math.round(clamp(0, 31, brow.y))
        : fallback.y,
    ...(typeof brow.length === "number"
      ? { length: Math.round(clamp(1, 8, brow.length)) }
      : fallback.length !== undefined
        ? { length: fallback.length }
        : {}),
  };
}

function normalizeMotion(
  motion: Partial<Motion> & Record<string, unknown>,
): Motion {
  return {
    blink:
      typeof motion.blink === "number"
        ? clamp(RANGE.motionField.min, RANGE.motionField.max, motion.blink)
        : DEFAULT_MOTION.blink,
    jitter:
      typeof motion.jitter === "number"
        ? clamp(RANGE.motionField.min, RANGE.motionField.max, motion.jitter)
        : DEFAULT_MOTION.jitter,
    breath:
      typeof motion.breath === "number"
        ? clamp(RANGE.motionField.min, RANGE.motionField.max, motion.breath)
        : DEFAULT_MOTION.breath,
    shake:
      typeof motion.shake === "number"
        ? clamp(RANGE.motionField.min, RANGE.motionField.max, motion.shake)
        : DEFAULT_MOTION.shake,
    glitch:
      typeof motion.glitch === "number"
        ? clamp(RANGE.motionField.min, RANGE.motionField.max, motion.glitch)
        : DEFAULT_MOTION.glitch,
  };
}

function normalizeMutation(
  mutation: Partial<Mutation> & Record<string, unknown>,
): Mutation {
  return {
    asymmetry:
      typeof mutation.asymmetry === "number"
        ? clamp(
            RANGE.mutationField.min,
            RANGE.mutationField.max,
            mutation.asymmetry,
          )
        : DEFAULT_MUTATION.asymmetry,
    randomness:
      typeof mutation.randomness === "number"
        ? clamp(
            RANGE.mutationField.min,
            RANGE.mutationField.max,
            mutation.randomness,
          )
        : DEFAULT_MUTATION.randomness,
    glitch:
      typeof mutation.glitch === "number"
        ? clamp(
            RANGE.mutationField.min,
            RANGE.mutationField.max,
            mutation.glitch,
          )
        : DEFAULT_MUTATION.glitch,
  };
}

export function normalizeExpression(input: unknown): EmotileExpression {
  const src =
    typeof input === "object" && input !== null && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  // canvas
  const rawCanvas =
    typeof src.canvas === "object" &&
    src.canvas !== null &&
    !Array.isArray(src.canvas)
      ? (src.canvas as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  const canvas = {
    width:
      typeof rawCanvas.width === "number"
        ? Math.round(clamp(32, 32, rawCanvas.width))
        : DEFAULT_CANVAS.width,
    height:
      typeof rawCanvas.height === "number"
        ? Math.round(clamp(32, 32, rawCanvas.height))
        : DEFAULT_CANVAS.height,
  };

  // face
  const rawFace =
    typeof src.face === "object" &&
    src.face !== null &&
    !Array.isArray(src.face)
      ? (src.face as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  const rawFaceShape =
    typeof rawFace.shape === "string" ? rawFace.shape : DEFAULT_FACE.shape;
  const face = {
    shape: (FACE_SHAPE_SET.has(rawFaceShape)
      ? rawFaceShape
      : DEFAULT_FACE.shape) as FaceShape,
    tilt:
      typeof rawFace.tilt === "number"
        ? clamp(RANGE.faceTilt.min, RANGE.faceTilt.max, rawFace.tilt)
        : DEFAULT_FACE.tilt,
    squash:
      typeof rawFace.squash === "number"
        ? clamp(RANGE.faceSquash.min, RANGE.faceSquash.max, rawFace.squash)
        : DEFAULT_FACE.squash,
  };

  // eyes
  const rawEyes =
    typeof src.eyes === "object" &&
    src.eyes !== null &&
    !Array.isArray(src.eyes)
      ? (src.eyes as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  const rawLeft =
    typeof rawEyes.left === "object" &&
    rawEyes.left !== null &&
    !Array.isArray(rawEyes.left)
      ? (rawEyes.left as Partial<Eye> & Record<string, unknown>)
      : ({} as Partial<Eye> & Record<string, unknown>);
  const rawRight =
    typeof rawEyes.right === "object" &&
    rawEyes.right !== null &&
    !Array.isArray(rawEyes.right)
      ? (rawEyes.right as Partial<Eye> & Record<string, unknown>)
      : ({} as Partial<Eye> & Record<string, unknown>);
  const eyes = {
    left: normalizeEye(rawLeft, DEFAULT_EYES.left),
    right: normalizeEye(rawRight, DEFAULT_EYES.right),
  };

  // mouth
  const rawMouth =
    typeof src.mouth === "object" &&
    src.mouth !== null &&
    !Array.isArray(src.mouth)
      ? (src.mouth as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  const rawMouthShape =
    typeof rawMouth.shape === "string" ? rawMouth.shape : DEFAULT_MOUTH.shape;
  const mouth = {
    shape: (MOUTH_SHAPE_SET.has(rawMouthShape)
      ? rawMouthShape
      : DEFAULT_MOUTH.shape) as MouthShape,
    x:
      typeof rawMouth.x === "number"
        ? Math.round(clamp(0, 31, rawMouth.x))
        : DEFAULT_MOUTH.x,
    y:
      typeof rawMouth.y === "number"
        ? Math.round(clamp(0, 31, rawMouth.y))
        : DEFAULT_MOUTH.y,
    width:
      typeof rawMouth.width === "number"
        ? Math.round(
            clamp(RANGE.mouthWidth.min, RANGE.mouthWidth.max, rawMouth.width),
          )
        : DEFAULT_MOUTH.width,
    curve:
      typeof rawMouth.curve === "number"
        ? clamp(RANGE.mouthCurve.min, RANGE.mouthCurve.max, rawMouth.curve)
        : DEFAULT_MOUTH.curve,
  };

  // brows
  const rawBrows =
    typeof src.brows === "object" &&
    src.brows !== null &&
    !Array.isArray(src.brows)
      ? (src.brows as Record<string, unknown>)
      : undefined;
  const brows = rawBrows
    ? {
        left:
          typeof rawBrows.left === "object" &&
          rawBrows.left !== null &&
          !Array.isArray(rawBrows.left)
            ? normalizeBrow(
                rawBrows.left as Partial<Brow> & Record<string, unknown>,
                DEFAULT_BROWS.left!,
              )
            : DEFAULT_BROWS.left,
        right:
          typeof rawBrows.right === "object" &&
          rawBrows.right !== null &&
          !Array.isArray(rawBrows.right)
            ? normalizeBrow(
                rawBrows.right as Partial<Brow> & Record<string, unknown>,
                DEFAULT_BROWS.right!,
              )
            : DEFAULT_BROWS.right,
      }
    : undefined;

  // marks
  const marks = Array.isArray(src.marks)
    ? (src.marks as unknown[])
        .filter(
          (m): m is Record<string, unknown> =>
            typeof m === "object" && m !== null && !Array.isArray(m),
        )
        .map((m) => {
          const rawType = typeof m.type === "string" ? m.type : "sweat";
          return {
            type: (MARK_TYPE_SET.has(rawType) ? rawType : "sweat") as MarkType,
            x: typeof m.x === "number" ? Math.round(clamp(0, 31, m.x)) : 16,
            y: typeof m.y === "number" ? Math.round(clamp(0, 31, m.y)) : 8,
            intensity:
              typeof m.intensity === "number"
                ? clamp(
                    RANGE.markIntensity.min,
                    RANGE.markIntensity.max,
                    m.intensity,
                  )
                : 0.5,
          };
        })
    : undefined;

  // motion
  const motion =
    typeof src.motion === "object" &&
    src.motion !== null &&
    !Array.isArray(src.motion)
      ? normalizeMotion(src.motion as Partial<Motion> & Record<string, unknown>)
      : { ...DEFAULT_MOTION };

  // mutation
  const mutation =
    typeof src.mutation === "object" &&
    src.mutation !== null &&
    !Array.isArray(src.mutation)
      ? normalizeMutation(
          src.mutation as Partial<Mutation> & Record<string, unknown>,
        )
      : { ...DEFAULT_MUTATION };

  return {
    version: "0.1",
    canvas,
    face,
    eyes,
    mouth,
    ...(brows ? { brows } : {}),
    ...(marks && marks.length > 0 ? { marks } : {}),
    motion,
    mutation,
  };
}
