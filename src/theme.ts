// Emotile v0.3 Theme / Palette Runtime — external to expression schema

import type { PixelColor, PixelFrame, ThemedPixel, ThemedFrame } from "./types";

/**
 * A theme maps Emotile semantic colors to concrete color values.
 * All fields are optional; missing fields use the default palette.
 */
export interface Theme {
  /** Primary face lines (eyes, mouth, brows) */
  primary?: string;
  /** Highlights and marks */
  accent?: string;
  /** Depth and secondary details */
  shadow?: string;
  /** Optional background fill */
  background?: string;
}

/**
 * Default palette matching the semantic color names.
 * Uses hex color strings for broad compatibility.
 */
export const DEFAULT_THEME: Required<Theme> = {
  primary: "#1a1a2e",
  accent: "#e94560",
  shadow: "#533483",
  background: "#ffffff",
};

/**
 * Validate that a color string looks like a hex color.
 * Accepts #RGB, #RRGGBB, #RGBA, #RRGGBBAA formats.
 */
export function isValidColor(color: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(color);
}

/**
 * Normalize a partial theme by filling missing keys with defaults.
 * Invalid color strings are replaced with the corresponding default.
 */
export function normalizeTheme(theme?: Theme): Required<Theme> {
  const resolve = (value: string | undefined, fallback: string): string => {
    if (typeof value === "string" && isValidColor(value)) {
      return value.toLowerCase();
    }
    return fallback;
  };

  return {
    primary: resolve(theme?.primary, DEFAULT_THEME.primary),
    accent: resolve(theme?.accent, DEFAULT_THEME.accent),
    shadow: resolve(theme?.shadow, DEFAULT_THEME.shadow),
    background: resolve(theme?.background, DEFAULT_THEME.background),
  };
}

/**
 * Map a semantic PixelColor to a concrete color string using a theme.
 */
export function mapPixelColor(
  color: PixelColor,
  theme: Required<Theme>,
): string {
  switch (color) {
    case "primary":
      return theme.primary;
    case "accent":
      return theme.accent;
    case "shadow":
      return theme.shadow;
    case "transparent":
      return "transparent";
    default:
      return theme.primary;
  }
}

/**
 * Options for applying a theme to a PixelFrame.
 */
export interface ApplyThemeOptions {
  theme?: Theme;
}

/**
 * Apply a theme to a PixelFrame, returning a new frame where each pixel
 * has its semantic color mapped to a concrete color string.
 *
 * The returned frame is a plain object suitable for downstream consumers
 * such as SVG renderers or terminal integrators.
 */
export function applyTheme(
  frame: PixelFrame,
  options: ApplyThemeOptions = {},
): ThemedFrame {
  const resolved = normalizeTheme(options.theme);
  return {
    width: frame.width,
    height: frame.height,
    pixels: frame.pixels.map((p) => ({
      x: p.x,
      y: p.y,
      color: mapPixelColor(p.color, resolved),
    })),
    theme: resolved,
  };
}
