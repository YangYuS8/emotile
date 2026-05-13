// Emotile v0.1 Schema Constants & Defaults

import type {
  Canvas,
  Face,
  Eye,
  Eyes,
  Mouth,
  Brow,
  Brows,
  Mark,
  Motion,
  Mutation,
  EmotileExpression,
  EyeShape,
  MouthShape,
  FaceShape,
  MarkType,
} from "./types";

// --- Legal values ---

export const FACE_SHAPES: readonly FaceShape[] = [
  "none",
  "circle",
  "soft_square",
];

export const EYE_SHAPES: readonly EyeShape[] = [
  "dot",
  "line",
  "arc",
  "closed",
  "cross",
  "star",
  "hollow",
  "spiral",
];

export const MOUTH_SHAPES: readonly MouthShape[] = [
  "flat",
  "smile",
  "sad",
  "open",
  "wave",
  "broken",
  "tiny_o",
  "hidden",
];

export const MARK_TYPES: readonly MarkType[] = [
  "sweat",
  "question",
  "exclamation",
  "heart",
  "sparkle",
  "smoke",
  "anger",
  "ellipsis",
];

// --- Ranges ---

export const RANGE = {
  faceTilt: { min: -15, max: 15 },
  faceSquash: { min: -0.3, max: 0.3 },
  eyeOpenness: { min: 0, max: 1 },
  eyeSize: { min: 1, max: 8 },
  mouthCurve: { min: -1, max: 1 },
  mouthWidth: { min: 1, max: 16 },
  markIntensity: { min: 0, max: 1 },
  motionField: { min: 0, max: 1 },
  mutationField: { min: 0, max: 1 },
} as const;

// --- Defaults ---

export const DEFAULT_CANVAS: Canvas = { width: 32, height: 32 };

export const DEFAULT_FACE: Face = { shape: "none", tilt: 0, squash: 0 };

export const DEFAULT_EYE: Eye = {
  shape: "dot",
  x: 0,
  y: 0,
  size: 3,
  openness: 1,
};

export const DEFAULT_EYES: Eyes = {
  left: { ...DEFAULT_EYE, x: 10, y: 12 },
  right: { ...DEFAULT_EYE, x: 21, y: 12 },
};

export const DEFAULT_MOUTH: Mouth = {
  shape: "flat",
  x: 16,
  y: 22,
  width: 6,
  curve: 0,
};

export const DEFAULT_BROW: Brow = { angle: 0, y: 9, length: 4 };

export const DEFAULT_BROWS: Brows = {
  left: { ...DEFAULT_BROW },
  right: { ...DEFAULT_BROW },
};

export const DEFAULT_MOTION: Motion = {
  blink: 0,
  jitter: 0,
  breath: 0,
  shake: 0,
  glitch: 0,
};

export const DEFAULT_MUTATION: Mutation = {
  asymmetry: 0,
  randomness: 0,
  glitch: 0,
};

export const DEFAULT_EXPRESSION: EmotileExpression = {
  version: "0.1",
  canvas: { ...DEFAULT_CANVAS },
  face: { ...DEFAULT_FACE },
  eyes: {
    left: { ...DEFAULT_EYES.left },
    right: { ...DEFAULT_EYES.right },
  },
  mouth: { ...DEFAULT_MOUTH },
  brows: {
    left: { ...DEFAULT_BROW },
    right: { ...DEFAULT_BROW },
  },
  motion: { ...DEFAULT_MOTION },
  mutation: { ...DEFAULT_MUTATION },
};
