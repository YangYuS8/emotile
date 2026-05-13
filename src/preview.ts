// Emotile v0.1 ASCII Preview — lightweight debug output for PixelFrame

import type { PixelFrame, PixelColor } from "./types";

const COLOR_CHARS: Record<PixelColor, string> = {
  transparent: " ",
  primary: "#",
  accent: "@",
  shadow: "-",
};

/**
 * Render a PixelFrame as an ASCII string suitable for terminal output.
 *
 * Each pixel is represented by a single character based on its color:
 * - `"#"` = primary
 * - `"@"` = accent
 * - `"-"` = shadow
 * - `" "` = transparent / empty
 *
 * The output preserves the canvas aspect ratio with one character per pixel.
 */
export function renderPixelFrameToASCII(frame: PixelFrame): string {
  const { width, height } = frame;
  // Build a 2D grid initialized to transparent
  const grid: string[][] = [];
  for (let y = 0; y < height; y++) {
    const row: string[] = [];
    for (let x = 0; x < width; x++) {
      row.push(COLOR_CHARS.transparent);
    }
    grid.push(row);
  }

  // Place pixels (last write wins, matching renderExpression behavior)
  for (const p of frame.pixels) {
    if (p.x >= 0 && p.x < width && p.y >= 0 && p.y < height) {
      grid[p.y][p.x] = COLOR_CHARS[p.color] ?? COLOR_CHARS.primary;
    }
  }

  return grid.map((row) => row.join("")).join("\n");
}
