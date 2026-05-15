// Emotile v0.3 JSON Schema — hand-maintained, mirrors TypeScript types
//
// This schema describes the current Emotile expression format for agents
// and integrations that request structured output. It does not change
// the expression format or schema version.

export const EMOTILE_EXPRESSION_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "EmotileExpression",
  description:
    "A pixel expression for AI agents. Describes a facial expression using structured primitives.",
  type: "object",
  required: ["version", "canvas", "face", "eyes", "mouth"],
  properties: {
    version: {
      type: "string",
      const: "0.1",
      description: "Expression format version",
    },
    canvas: {
      type: "object",
      required: ["width", "height"],
      properties: {
        width: { type: "number", const: 32, description: "Canvas width (fixed 32)" },
        height: { type: "number", const: 32, description: "Canvas height (fixed 32)" },
      },
    },
    face: {
      type: "object",
      required: ["shape", "tilt", "squash"],
      properties: {
        shape: {
          type: "string",
          enum: ["none", "circle", "soft_square"],
          description: "Face outline shape",
        },
        tilt: {
          type: "number",
          minimum: -15,
          maximum: 15,
          description: "Face tilt angle in degrees",
        },
        squash: {
          type: "number",
          minimum: -0.3,
          maximum: 0.3,
          description: "Vertical squash factor",
        },
      },
    },
    eyes: {
      type: "object",
      required: ["left", "right"],
      properties: {
        left: { $ref: "#/definitions/eye" },
        right: { $ref: "#/definitions/eye" },
      },
    },
    mouth: {
      type: "object",
      required: ["shape", "x", "y", "width", "curve"],
      properties: {
        shape: {
          type: "string",
          enum: [
            "flat",
            "smile",
            "sad",
            "open",
            "wave",
            "broken",
            "tiny_o",
            "hidden",
          ],
          description: "Mouth shape",
        },
        x: { type: "number", minimum: 0, maximum: 31, description: "Mouth X position" },
        y: { type: "number", minimum: 0, maximum: 31, description: "Mouth Y position" },
        width: { type: "number", minimum: 1, maximum: 16, description: "Mouth width" },
        curve: { type: "number", minimum: -1, maximum: 1, description: "Mouth curvature" },
      },
    },
    brows: {
      type: "object",
      properties: {
        left: { $ref: "#/definitions/brow" },
        right: { $ref: "#/definitions/brow" },
      },
    },
    marks: {
      type: "array",
      items: { $ref: "#/definitions/mark" },
      description: "Decorative marks (optional)",
    },
    motion: {
      type: "object",
      properties: {
        blink: { type: "number", minimum: 0, maximum: 1 },
        jitter: { type: "number", minimum: 0, maximum: 1 },
        breath: { type: "number", minimum: 0, maximum: 1 },
        shake: { type: "number", minimum: 0, maximum: 1 },
        glitch: { type: "number", minimum: 0, maximum: 1 },
      },
    },
    mutation: {
      type: "object",
      properties: {
        asymmetry: { type: "number", minimum: 0, maximum: 1 },
        randomness: { type: "number", minimum: 0, maximum: 1 },
        glitch: { type: "number", minimum: 0, maximum: 1 },
      },
    },
  },
  definitions: {
    eye: {
      type: "object",
      required: ["shape", "x", "y", "size", "openness"],
      properties: {
        shape: {
          type: "string",
          enum: [
            "dot",
            "line",
            "arc",
            "closed",
            "cross",
            "star",
            "hollow",
            "spiral",
          ],
          description: "Eye shape",
        },
        x: { type: "number", minimum: 0, maximum: 31 },
        y: { type: "number", minimum: 0, maximum: 31 },
        size: { type: "number", minimum: 1, maximum: 8, description: "Eye size" },
        openness: { type: "number", minimum: 0, maximum: 1, description: "Eye openness" },
        angle: {
          type: "number",
          minimum: -180,
          maximum: 180,
          description: "Eye rotation angle (optional)",
        },
      },
    },
    brow: {
      type: "object",
      required: ["angle", "y"],
      properties: {
        angle: { type: "number", minimum: -90, maximum: 90, description: "Brow angle" },
        y: { type: "number", minimum: 0, maximum: 31, description: "Brow Y position" },
        length: {
          type: "number",
          minimum: 1,
          maximum: 8,
          description: "Brow length (optional)",
        },
      },
    },
    mark: {
      type: "object",
      required: ["type", "x", "y", "intensity"],
      properties: {
        type: {
          type: "string",
          enum: [
            "sweat",
            "question",
            "exclamation",
            "heart",
            "sparkle",
            "smoke",
            "anger",
            "ellipsis",
          ],
          description: "Mark type",
        },
        x: { type: "number", minimum: 0, maximum: 31 },
        y: { type: "number", minimum: 0, maximum: 31 },
        intensity: {
          type: "number",
          minimum: 0,
          maximum: 1,
          description: "Mark intensity",
        },
      },
    },
  },
} as const;

/**
 * Get the Emotile expression JSON Schema as a plain object.
 * Useful for agents and integrations that need structured output constraints.
 */
export function getExpressionSchema(): typeof EMOTILE_EXPRESSION_SCHEMA {
  return JSON.parse(JSON.stringify(EMOTILE_EXPRESSION_SCHEMA));
}
