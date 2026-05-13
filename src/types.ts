// Emotile v0.1 Type Definitions

// --- Enums / Unions ---

export type FaceShape = "none" | "circle" | "soft_square";

export type EyeShape =
  | "dot"
  | "line"
  | "arc"
  | "closed"
  | "cross"
  | "star"
  | "hollow"
  | "spiral";

export type MouthShape =
  | "flat"
  | "smile"
  | "sad"
  | "open"
  | "wave"
  | "broken"
  | "tiny_o"
  | "hidden";

export type MarkType =
  | "sweat"
  | "question"
  | "exclamation"
  | "heart"
  | "sparkle"
  | "smoke"
  | "anger"
  | "ellipsis";

// --- Structs ---

export interface Canvas {
  width: number;
  height: number;
}

export interface Face {
  shape: FaceShape;
  tilt: number;
  squash: number;
}

export interface Eye {
  shape: EyeShape;
  x: number;
  y: number;
  size: number;
  openness: number;
  angle?: number;
}

export interface Eyes {
  left: Eye;
  right: Eye;
}

export interface Mouth {
  shape: MouthShape;
  x: number;
  y: number;
  width: number;
  curve: number;
}

export interface Brow {
  angle: number;
  y: number;
  length?: number;
}

export interface Brows {
  left?: Brow;
  right?: Brow;
}

export interface Mark {
  type: MarkType;
  x: number;
  y: number;
  intensity: number;
}

export interface Motion {
  blink: number;
  jitter: number;
  breath: number;
  shake: number;
  glitch: number;
}

export interface Mutation {
  asymmetry: number;
  randomness: number;
  glitch: number;
}

// --- Top-level ---

export interface EmotileExpression {
  version: "0.1";
  canvas: Canvas;
  face: Face;
  eyes: Eyes;
  mouth: Mouth;
  brows?: Brows;
  marks?: Mark[];
  motion?: Motion;
  mutation?: Mutation;
}

// --- Validation ---

export interface ValidationError {
  path: string;
  message: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T; errors: [] }
  | { ok: false; value?: undefined; errors: ValidationError[] };

// --- Repair ---

export interface RepairWarning {
  path: string;
  message: string;
}

export interface RepairResult {
  value: EmotileExpression;
  warnings: RepairWarning[];
}

// --- Render ---

export type PixelColor = "transparent" | "primary" | "accent" | "shadow";

export interface Pixel {
  x: number;
  y: number;
  color: PixelColor;
}

export interface PixelFrame {
  width: number;
  height: number;
  pixels: Pixel[];
}

// --- Mutate ---

export interface MutateOptions {
  seed?: string | number;
  amount?: number;
}
