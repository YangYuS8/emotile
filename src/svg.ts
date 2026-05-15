// Emotile v0.3 SVG Renderer — pure string output, no DOM/Canvas/browser

import type { PixelFrame, PixelColor } from "./types";
import type { Theme } from "./theme";
import { normalizeTheme, mapPixelColor } from "./theme";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface SVGRenderOptions {
  /** Pixel size in SVG units (default 10) */
  pixelSize?: number;
  /** Optional theme for color mapping */
  theme?: Theme;
  /** Whether to fill the background (default false) */
  background?: boolean;
  /** Optional CSS class prefix for styling */
  classPrefix?: string;
}

/**
 * Render a PixelFrame as an SVG string.
 *
 * Output is pure data — no DOM, Canvas, browser, GPU, or filesystem side effects.
 * The same input always produces the same output string.
 *
 * @param frame — a PixelFrame (output of renderExpression or applyTheme)
 * @param options — pixel size, theme, background fill, class prefix
 * @returns deterministic SVG string
 */
export function renderPixelFrameToSVG(
  frame: PixelFrame,
  options: SVGRenderOptions = {},
): string {
  const pixelSize = Math.max(1, Math.round(options.pixelSize ?? 10));
  const theme = normalizeTheme(options.theme);
  const showBackground = options.background ?? false;
  const classPrefix = options.classPrefix ?? "emotile";

  const width = frame.width * pixelSize;
  const height = frame.height * pixelSize;

  const rectAttrs = (x: number, y: number, color: string): string => {
    const cx = x * pixelSize;
    const cy = y * pixelSize;
    const safeColor = escapeXml(color);
    return `  <rect x="${cx}" y="${cy}" width="${pixelSize}" height="${pixelSize}" fill="${safeColor}" class="${classPrefix}-pixel" />`;
  };

  const lines: string[] = [];

  // XML declaration and SVG root
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="${classPrefix}">`,
  );

  // Optional background
  if (showBackground) {
    lines.push(
      `  <rect width="${width}" height="${height}" fill="${escapeXml(theme.background)}" class="${classPrefix}-bg" />`,
    );
  }

  // Group for pixels
  lines.push(`  <g class="${classPrefix}-pixels">`);

  for (const p of frame.pixels) {
    if (p.color === "transparent") continue;
    const concrete = mapPixelColor(p.color as PixelColor, theme);
    lines.push(rectAttrs(p.x, p.y, concrete));
  }

  lines.push("  </g>");
  lines.push("</svg>");

  return lines.join("\n");
}
