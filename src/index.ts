// Emotile — Pixel expression language and runtime for AI agents

export type {
  FaceShape,
  EyeShape,
  MouthShape,
  MarkType,
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
  ValidationError,
  ValidationResult,
  RepairWarning,
  RepairResult,
  PixelColor,
  Pixel,
  PixelFrame,
  MutateOptions,
} from "./types";

export { validateExpression } from "./validate";
export { normalizeExpression } from "./normalize";
export { repairExpression } from "./repair";
export { renderExpression } from "./render";
export { renderPixelFrameToASCII } from "./preview";
export { mutateExpression } from "./mutate";

export {
  FACE_SHAPES,
  EYE_SHAPES,
  MOUTH_SHAPES,
  MARK_TYPES,
  RANGE,
  DEFAULT_CANVAS,
  DEFAULT_FACE,
  DEFAULT_EYE,
  DEFAULT_EYES,
  DEFAULT_MOUTH,
  DEFAULT_BROW,
  DEFAULT_BROWS,
  DEFAULT_MOTION,
  DEFAULT_MUTATION,
  DEFAULT_EXPRESSION,
} from "./schema";
