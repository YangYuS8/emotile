// Emotile v0.1 Validator

import type {
  EmotileExpression,
  ValidationResult,
  ValidationError,
  EyeShape,
  MouthShape,
  FaceShape,
  MarkType,
} from "./types";
import {
  FACE_SHAPES,
  EYE_SHAPES,
  MOUTH_SHAPES,
  MARK_TYPES,
  RANGE,
} from "./schema";

const FACE_SHAPE_SET = new Set<string>(FACE_SHAPES);
const EYE_SHAPE_SET = new Set<string>(EYE_SHAPES);
const MOUTH_SHAPE_SET = new Set<string>(MOUTH_SHAPES);
const MARK_TYPE_SET = new Set<string>(MARK_TYPES);

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function clamp(min: number, max: number, v: number): number {
  return Math.min(max, Math.max(min, v));
}

function validateRange(
  path: string,
  value: unknown,
  min: number,
  max: number,
  errors: ValidationError[],
  required = true
): void {
  if (value === undefined || value === null) {
    if (required) errors.push({ path, message: "is required" });
    return;
  }
  if (typeof value !== "number") {
    errors.push({ path, message: "must be a number" });
    return;
  }
  if (value < min || value > max) {
    errors.push({
      path,
      message: `must be between ${min} and ${max}`,
    });
  }
}

function validateEnum(
  path: string,
  value: unknown,
  validSet: Set<string>,
  label: string,
  errors: ValidationError[]
): void {
  if (value === undefined || value === null) {
    errors.push({ path, message: "is required" });
    return;
  }
  if (typeof value !== "string" || !validSet.has(value)) {
    errors.push({
      path,
      message: `must be one of: ${[...validSet].join(", ")}`,
    });
  }
}

function validateEye(
  path: string,
  eye: unknown,
  errors: ValidationError[]
): void {
  if (!isObject(eye)) {
    errors.push({ path, message: "must be an object" });
    return;
  }
  validateEnum(path + ".shape", eye.shape, EYE_SHAPE_SET, "EyeShape", errors);
  validateRange(path + ".x", eye.x, 0, 31, errors);
  validateRange(path + ".y", eye.y, 0, 31, errors);
  validateRange(
    path + ".size",
    eye.size,
    RANGE.eyeSize.min,
    RANGE.eyeSize.max,
    errors
  );
  validateRange(
    path + ".openness",
    eye.openness,
    RANGE.eyeOpenness.min,
    RANGE.eyeOpenness.max,
    errors
  );
  if (eye.angle !== undefined && eye.angle !== null) {
    validateRange(path + ".angle", eye.angle, -180, 180, errors, false);
  }
}

function validateBrow(
  path: string,
  brow: unknown,
  errors: ValidationError[]
): void {
  if (!isObject(brow)) {
    errors.push({ path, message: "must be an object" });
    return;
  }
  validateRange(path + ".angle", brow.angle, -90, 90, errors);
  validateRange(path + ".y", brow.y, 0, 31, errors);
  if (brow.length !== undefined && brow.length !== null) {
    validateRange(path + ".length", brow.length, 1, 8, errors, false);
  }
}

function validateMark(
  path: string,
  mark: unknown,
  errors: ValidationError[]
): void {
  if (!isObject(mark)) {
    errors.push({ path, message: "must be an object" });
    return;
  }
  validateEnum(
    path + ".type",
    mark.type,
    MARK_TYPE_SET,
    "MarkType",
    errors
  );
  validateRange(path + ".x", mark.x, 0, 31, errors);
  validateRange(path + ".y", mark.y, 0, 31, errors);
  validateRange(
    path + ".intensity",
    mark.intensity,
    RANGE.markIntensity.min,
    RANGE.markIntensity.max,
    errors
  );
}

function validateMotion(
  path: string,
  motion: unknown,
  errors: ValidationError[]
): void {
  if (!isObject(motion)) {
    errors.push({ path, message: "must be an object" });
    return;
  }
  validateRange(
    path + ".blink",
    motion.blink,
    RANGE.motionField.min,
    RANGE.motionField.max,
    errors
  );
  validateRange(
    path + ".jitter",
    motion.jitter,
    RANGE.motionField.min,
    RANGE.motionField.max,
    errors
  );
  validateRange(
    path + ".breath",
    motion.breath,
    RANGE.motionField.min,
    RANGE.motionField.max,
    errors
  );
  validateRange(
    path + ".shake",
    motion.shake,
    RANGE.motionField.min,
    RANGE.motionField.max,
    errors
  );
  validateRange(
    path + ".glitch",
    motion.glitch,
    RANGE.motionField.min,
    RANGE.motionField.max,
    errors
  );
}

function validateMutation(
  path: string,
  mutation: unknown,
  errors: ValidationError[]
): void {
  if (!isObject(mutation)) {
    errors.push({ path, message: "must be an object" });
    return;
  }
  validateRange(
    path + ".asymmetry",
    mutation.asymmetry,
    RANGE.mutationField.min,
    RANGE.mutationField.max,
    errors
  );
  validateRange(
    path + ".randomness",
    mutation.randomness,
    RANGE.mutationField.min,
    RANGE.mutationField.max,
    errors
  );
  validateRange(
    path + ".glitch",
    mutation.glitch,
    RANGE.mutationField.min,
    RANGE.mutationField.max,
    errors
  );
}

export function validateExpression(
  input: unknown
): ValidationResult<EmotileExpression> {
  const errors: ValidationError[] = [];

  if (!isObject(input)) {
    return { ok: false, errors: [{ path: "", message: "must be an object" }] };
  }

  // version
  if (input.version !== "0.1") {
    errors.push({
      path: "version",
      message: 'must be "0.1"',
    });
  }

  // canvas
  if (!isObject(input.canvas)) {
    errors.push({ path: "canvas", message: "must be an object" });
  } else {
    validateRange("canvas.width", input.canvas.width, 1, 256, errors);
    validateRange("canvas.height", input.canvas.height, 1, 256, errors);
  }

  // face
  if (!isObject(input.face)) {
    errors.push({ path: "face", message: "must be an object" });
  } else {
    validateEnum(
      "face.shape",
      input.face.shape,
      FACE_SHAPE_SET,
      "FaceShape",
      errors
    );
    validateRange(
      "face.tilt",
      input.face.tilt,
      RANGE.faceTilt.min,
      RANGE.faceTilt.max,
      errors
    );
    validateRange(
      "face.squash",
      input.face.squash,
      RANGE.faceSquash.min,
      RANGE.faceSquash.max,
      errors
    );
  }

  // eyes
  if (!isObject(input.eyes)) {
    errors.push({ path: "eyes", message: "must be an object" });
  } else {
    if (!isObject(input.eyes.left)) {
      errors.push({ path: "eyes.left", message: "must be an object" });
    } else {
      validateEye("eyes.left", input.eyes.left, errors);
    }
    if (!isObject(input.eyes.right)) {
      errors.push({ path: "eyes.right", message: "must be an object" });
    } else {
      validateEye("eyes.right", input.eyes.right, errors);
    }
  }

  // mouth
  if (!isObject(input.mouth)) {
    errors.push({ path: "mouth", message: "must be an object" });
  } else {
    validateEnum(
      "mouth.shape",
      input.mouth.shape,
      MOUTH_SHAPE_SET,
      "MouthShape",
      errors
    );
    validateRange("mouth.x", input.mouth.x, 0, 31, errors);
    validateRange("mouth.y", input.mouth.y, 0, 31, errors);
    validateRange(
      "mouth.width",
      input.mouth.width,
      RANGE.mouthWidth.min,
      RANGE.mouthWidth.max,
      errors
    );
    validateRange(
      "mouth.curve",
      input.mouth.curve,
      RANGE.mouthCurve.min,
      RANGE.mouthCurve.max,
      errors
    );
  }

  // brows (optional)
  if (input.brows !== undefined && input.brows !== null) {
    if (!isObject(input.brows)) {
      errors.push({ path: "brows", message: "must be an object" });
    } else {
      if (input.brows.left !== undefined && input.brows.left !== null) {
        validateBrow("brows.left", input.brows.left, errors);
      }
      if (input.brows.right !== undefined && input.brows.right !== null) {
        validateBrow("brows.right", input.brows.right, errors);
      }
    }
  }

  // marks (optional)
  if (input.marks !== undefined && input.marks !== null) {
    if (!Array.isArray(input.marks)) {
      errors.push({ path: "marks", message: "must be an array" });
    } else {
      input.marks.forEach((mark: unknown, i: number) => {
        validateMark(`marks[${i}]`, mark, errors);
      });
    }
  }

  // motion (optional)
  if (input.motion !== undefined && input.motion !== null) {
    validateMotion("motion", input.motion, errors);
  }

  // mutation (optional)
  if (input.mutation !== undefined && input.mutation !== null) {
    validateMutation("mutation", input.mutation, errors);
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: input as unknown as EmotileExpression, errors: [] };
}
