// Emotile v0.1 Repair

import type {
  EmotileExpression,
  Eye,
  EyeShape,
  MouthShape,
  FaceShape,
  MarkType,
  RepairWarning,
  RepairResult,
  Brow,
  Motion,
  Mutation,
} from "./types";
import {
  EYE_SHAPES,
  MOUTH_SHAPES,
  FACE_SHAPES,
  MARK_TYPES,
  DEFAULT_CANVAS,
  DEFAULT_FACE,
  DEFAULT_EYES,
  DEFAULT_MOUTH,
  DEFAULT_BROW,
  DEFAULT_MOTION,
  DEFAULT_MUTATION,
  DEFAULT_EXPRESSION,
  RANGE,
} from "./schema";

const EYE_SHAPE_SET = new Set<string>(EYE_SHAPES);
const MOUTH_SHAPE_SET = new Set<string>(MOUTH_SHAPES);
const FACE_SHAPE_SET = new Set<string>(FACE_SHAPES);
const MARK_TYPE_SET = new Set<string>(MARK_TYPES);

function clamp(min: number, max: number, v: number): number {
  return Math.min(max, Math.max(min, v));
}

function clampWithWarning(
  path: string,
  value: number,
  min: number,
  max: number,
  warnings: RepairWarning[],
): number {
  if (value < min || value > max) {
    warnings.push({
      path,
      message: `clamped ${value} to [${min}, ${max}]`,
    });
  }
  return clamp(min, max, value);
}

function repairEnum(
  path: string,
  value: unknown,
  validSet: Set<string>,
  fallback: string,
  warnings: RepairWarning[],
): string {
  if (typeof value === "string" && validSet.has(value)) {
    return value;
  }
  const original = typeof value === "string" ? value : String(value);
  warnings.push({
    path,
    message: `invalid value "${original}", falling back to "${fallback}"`,
  });
  return fallback;
}

function repairEye(
  path: string,
  raw: unknown,
  fallback: Eye,
  warnings: RepairWarning[],
): Eye {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    warnings.push({ path, message: "replaced with default eye" });
    return { ...fallback };
  }
  const src = raw as Record<string, unknown>;
  return {
    shape: repairEnum(
      path + ".shape",
      src.shape,
      EYE_SHAPE_SET,
      "dot",
      warnings,
    ) as EyeShape,
    x:
      typeof src.x === "number"
        ? clampWithWarning(path + ".x", src.x, 0, 31, warnings)
        : fallback.x,
    y:
      typeof src.y === "number"
        ? clampWithWarning(path + ".y", src.y, 0, 31, warnings)
        : fallback.y,
    size:
      typeof src.size === "number"
        ? clampWithWarning(
            path + ".size",
            src.size,
            RANGE.eyeSize.min,
            RANGE.eyeSize.max,
            warnings,
          )
        : fallback.size,
    openness:
      typeof src.openness === "number"
        ? clampWithWarning(
            path + ".openness",
            src.openness,
            RANGE.eyeOpenness.min,
            RANGE.eyeOpenness.max,
            warnings,
          )
        : fallback.openness,
    ...(typeof src.angle === "number"
      ? {
          angle: clampWithWarning(
            path + ".angle",
            src.angle,
            -180,
            180,
            warnings,
          ),
        }
      : fallback.angle !== undefined
        ? { angle: fallback.angle }
        : {}),
  };
}

function repairBrow(
  path: string,
  raw: unknown,
  fallback: Brow,
  warnings: RepairWarning[],
): Brow {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    warnings.push({ path, message: "replaced with default brow" });
    return { ...fallback };
  }
  const src = raw as Record<string, unknown>;
  return {
    angle:
      typeof src.angle === "number"
        ? clampWithWarning(path + ".angle", src.angle, -90, 90, warnings)
        : fallback.angle,
    y:
      typeof src.y === "number"
        ? clampWithWarning(path + ".y", src.y, 0, 31, warnings)
        : fallback.y,
    ...(typeof src.length === "number"
      ? {
          length: clampWithWarning(
            path + ".length",
            src.length,
            1,
            8,
            warnings,
          ),
        }
      : fallback.length !== undefined
        ? { length: fallback.length }
        : {}),
  };
}

function repairMotion(
  path: string,
  raw: unknown,
  warnings: RepairWarning[],
): Motion {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ...DEFAULT_MOTION };
  }
  const src = raw as Record<string, unknown>;
  return {
    blink:
      typeof src.blink === "number"
        ? clampWithWarning(
            path + ".blink",
            src.blink,
            RANGE.motionField.min,
            RANGE.motionField.max,
            warnings,
          )
        : DEFAULT_MOTION.blink,
    jitter:
      typeof src.jitter === "number"
        ? clampWithWarning(
            path + ".jitter",
            src.jitter,
            RANGE.motionField.min,
            RANGE.motionField.max,
            warnings,
          )
        : DEFAULT_MOTION.jitter,
    breath:
      typeof src.breath === "number"
        ? clampWithWarning(
            path + ".breath",
            src.breath,
            RANGE.motionField.min,
            RANGE.motionField.max,
            warnings,
          )
        : DEFAULT_MOTION.breath,
    shake:
      typeof src.shake === "number"
        ? clampWithWarning(
            path + ".shake",
            src.shake,
            RANGE.motionField.min,
            RANGE.motionField.max,
            warnings,
          )
        : DEFAULT_MOTION.shake,
    glitch:
      typeof src.glitch === "number"
        ? clampWithWarning(
            path + ".glitch",
            src.glitch,
            RANGE.motionField.min,
            RANGE.motionField.max,
            warnings,
          )
        : DEFAULT_MOTION.glitch,
  };
}

function repairMutation(
  path: string,
  raw: unknown,
  warnings: RepairWarning[],
): Mutation {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ...DEFAULT_MUTATION };
  }
  const src = raw as Record<string, unknown>;
  return {
    asymmetry:
      typeof src.asymmetry === "number"
        ? clampWithWarning(
            path + ".asymmetry",
            src.asymmetry,
            RANGE.mutationField.min,
            RANGE.mutationField.max,
            warnings,
          )
        : DEFAULT_MUTATION.asymmetry,
    randomness:
      typeof src.randomness === "number"
        ? clampWithWarning(
            path + ".randomness",
            src.randomness,
            RANGE.mutationField.min,
            RANGE.mutationField.max,
            warnings,
          )
        : DEFAULT_MUTATION.randomness,
    glitch:
      typeof src.glitch === "number"
        ? clampWithWarning(
            path + ".glitch",
            src.glitch,
            RANGE.mutationField.min,
            RANGE.mutationField.max,
            warnings,
          )
        : DEFAULT_MUTATION.glitch,
  };
}

export function repairExpression(input: unknown): RepairResult {
  const warnings: RepairWarning[] = [];

  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    warnings.push({
      path: "",
      message: "input is not an object, using full default",
    });
    return { value: { ...DEFAULT_EXPRESSION }, warnings };
  }

  const src = input as Record<string, unknown>;

  // version
  if (src.version !== "0.1") {
    warnings.push({
      path: "version",
      message: `invalid version "${src.version}", setting to "0.1"`,
    });
  }

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
        ? clampWithWarning("canvas.width", rawCanvas.width, 32, 32, warnings)
        : DEFAULT_CANVAS.width,
    height:
      typeof rawCanvas.height === "number"
        ? clampWithWarning("canvas.height", rawCanvas.height, 32, 32, warnings)
        : DEFAULT_CANVAS.height,
  };

  // face
  const rawFace =
    typeof src.face === "object" &&
    src.face !== null &&
    !Array.isArray(src.face)
      ? (src.face as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  const face = {
    shape: repairEnum(
      "face.shape",
      rawFace.shape,
      FACE_SHAPE_SET,
      "none",
      warnings,
    ) as FaceShape,
    tilt:
      typeof rawFace.tilt === "number"
        ? clampWithWarning(
            "face.tilt",
            rawFace.tilt,
            RANGE.faceTilt.min,
            RANGE.faceTilt.max,
            warnings,
          )
        : DEFAULT_FACE.tilt,
    squash:
      typeof rawFace.squash === "number"
        ? clampWithWarning(
            "face.squash",
            rawFace.squash,
            RANGE.faceSquash.min,
            RANGE.faceSquash.max,
            warnings,
          )
        : DEFAULT_FACE.squash,
  };

  // eyes
  const rawEyes =
    typeof src.eyes === "object" &&
    src.eyes !== null &&
    !Array.isArray(src.eyes)
      ? (src.eyes as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  const eyes = {
    left: repairEye("eyes.left", rawEyes.left, DEFAULT_EYES.left, warnings),
    right: repairEye("eyes.right", rawEyes.right, DEFAULT_EYES.right, warnings),
  };

  // mouth
  const rawMouth =
    typeof src.mouth === "object" &&
    src.mouth !== null &&
    !Array.isArray(src.mouth)
      ? (src.mouth as Record<string, unknown>)
      : ({} as Record<string, unknown>);
  const mouth = {
    shape: repairEnum(
      "mouth.shape",
      rawMouth.shape,
      MOUTH_SHAPE_SET,
      "flat",
      warnings,
    ) as MouthShape,
    x:
      typeof rawMouth.x === "number"
        ? clampWithWarning("mouth.x", rawMouth.x, 0, 31, warnings)
        : DEFAULT_MOUTH.x,
    y:
      typeof rawMouth.y === "number"
        ? clampWithWarning("mouth.y", rawMouth.y, 0, 31, warnings)
        : DEFAULT_MOUTH.y,
    width:
      typeof rawMouth.width === "number"
        ? clampWithWarning(
            "mouth.width",
            rawMouth.width,
            RANGE.mouthWidth.min,
            RANGE.mouthWidth.max,
            warnings,
          )
        : DEFAULT_MOUTH.width,
    curve:
      typeof rawMouth.curve === "number"
        ? clampWithWarning(
            "mouth.curve",
            rawMouth.curve,
            RANGE.mouthCurve.min,
            RANGE.mouthCurve.max,
            warnings,
          )
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
        left: repairBrow("brows.left", rawBrows.left, DEFAULT_BROW, warnings),
        right: repairBrow(
          "brows.right",
          rawBrows.right,
          DEFAULT_BROW,
          warnings,
        ),
      }
    : undefined;

  // marks
  let marks: EmotileExpression["marks"] = undefined;
  if (Array.isArray(src.marks)) {
    const repaired: EmotileExpression["marks"] = [];
    (src.marks as unknown[]).forEach((raw, i) => {
      if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
        warnings.push({
          path: `marks[${i}]`,
          message: "skipped non-object mark element",
        });
        return;
      }
      const m = raw as Record<string, unknown>;
      const markType = repairEnum(
        `marks[${i}].type`,
        m.type,
        MARK_TYPE_SET,
        "sweat",
        warnings,
      ) as MarkType;
      repaired.push({
        type: markType,
        x:
          typeof m.x === "number"
            ? clampWithWarning(`marks[${i}].x`, m.x, 0, 31, warnings)
            : 16,
        y:
          typeof m.y === "number"
            ? clampWithWarning(`marks[${i}].y`, m.y, 0, 31, warnings)
            : 8,
        intensity:
          typeof m.intensity === "number"
            ? clampWithWarning(
                `marks[${i}].intensity`,
                m.intensity,
                RANGE.markIntensity.min,
                RANGE.markIntensity.max,
                warnings,
              )
            : 0.5,
      });
    });
    marks = repaired.length > 0 ? repaired : undefined;
  }

  // motion
  const motion = repairMotion("motion", src.motion, warnings);

  // mutation
  const mutation = repairMutation("mutation", src.mutation, warnings);

  const value: EmotileExpression = {
    version: "0.1",
    canvas,
    face,
    eyes,
    mouth,
    ...(brows ? { brows } : {}),
    ...(marks ? { marks } : {}),
    motion,
    mutation,
  };

  return { value, warnings };
}
