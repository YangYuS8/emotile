// Emotile v0.1 Renderer — pure data pixel frame output

import type {
  EmotileExpression,
  PixelFrame,
  Pixel,
  PixelColor,
  Eye,
  EyeShape,
  Mouth,
  MouthShape,
  Mark,
  MarkType,
} from "./types";

function putPixel(
  pixels: Pixel[],
  x: number,
  y: number,
  color: PixelColor,
): void {
  pixels.push({ x: Math.round(x), y: Math.round(y), color });
}

function putHLine(
  pixels: Pixel[],
  x0: number,
  x1: number,
  y: number,
  color: PixelColor,
): void {
  const lo = Math.round(Math.min(x0, x1));
  const hi = Math.round(Math.max(x0, x1));
  for (let x = lo; x <= hi; x++) {
    putPixel(pixels, x, y, color);
  }
}

function putCircle(
  pixels: Pixel[],
  cx: number,
  cy: number,
  r: number,
  color: PixelColor,
  fill = false,
): void {
  // Bresenham-style circle
  const ri = Math.round(r);
  if (ri <= 0) {
    putPixel(pixels, Math.round(cx), Math.round(cy), color);
    return;
  }
  for (let dy = -ri; dy <= ri; dy++) {
    for (let dx = -ri; dx <= ri; dx++) {
      const dist = dx * dx + dy * dy;
      if (fill ? dist <= ri * ri + ri : Math.abs(dist - ri * ri) <= ri + 0.5) {
        putPixel(pixels, Math.round(cx) + dx, Math.round(cy) + dy, color);
      }
    }
  }
}

// --- Eye renderers ---

function renderDotEye(pixels: Pixel[], eye: Eye): void {
  const r = Math.max(1, Math.round(eye.size / 2));
  putCircle(pixels, eye.x, eye.y, r, "primary", true);
  // highlight
  if (r >= 2 && eye.openness > 0.3) {
    putPixel(pixels, Math.round(eye.x) - 1, Math.round(eye.y) - 1, "accent");
  }
}

function renderLineEye(pixels: Pixel[], eye: Eye): void {
  const half = Math.round(eye.size / 2);
  const angle = ((eye.angle ?? 0) * Math.PI) / 180;
  const dx = Math.round(Math.cos(angle) * half);
  const dy = Math.round(Math.sin(angle) * half);
  for (let t = -half; t <= half; t++) {
    const px = Math.round(eye.x + (dx / half) * t);
    const py = Math.round(eye.y + (dy / half) * t);
    putPixel(pixels, px, py, "primary");
  }
}

function renderArcEye(pixels: Pixel[], eye: Eye): void {
  const r = Math.max(1, Math.round(eye.size / 2));
  const openness = eye.openness;
  // Draw an arc: upper half of circle, openness controls how open the arc is
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r + r) {
        // only show pixels in the upper portion based on openness
        const threshold = r * (1 - openness * 2);
        if (dy <= threshold) {
          putPixel(
            pixels,
            Math.round(eye.x) + dx,
            Math.round(eye.y) + dy,
            "primary",
          );
        }
      }
    }
  }
}

function renderClosedEye(pixels: Pixel[], eye: Eye): void {
  const half = Math.round(eye.size / 2);
  putHLine(pixels, eye.x - half, eye.x + half, Math.round(eye.y), "primary");
}

function renderCrossEye(pixels: Pixel[], eye: Eye): void {
  const half = Math.max(1, Math.round(eye.size / 2));
  // horizontal
  putHLine(pixels, eye.x - half, eye.x + half, Math.round(eye.y), "primary");
  // vertical
  for (let dy = -half; dy <= half; dy++) {
    putPixel(pixels, Math.round(eye.x), Math.round(eye.y) + dy, "primary");
  }
}

function renderStarEye(pixels: Pixel[], eye: Eye): void {
  const r = Math.max(1, Math.round(eye.size / 2));
  // center dot + 4 diagonal rays
  putCircle(pixels, eye.x, eye.y, 1, "accent", true);
  for (let i = 0; i < 4; i++) {
    const angle = ((45 + i * 90) * Math.PI) / 180;
    for (let d = 1; d <= r; d++) {
      putPixel(
        pixels,
        Math.round(eye.x + Math.cos(angle) * d),
        Math.round(eye.y + Math.sin(angle) * d),
        "primary",
      );
    }
  }
}

function renderHollowEye(pixels: Pixel[], eye: Eye): void {
  const r = Math.max(1, Math.round(eye.size / 2));
  putCircle(pixels, eye.x, eye.y, r, "primary", false);
}

function renderSpiralEye(pixels: Pixel[], eye: Eye): void {
  const r = Math.max(1, Math.round(eye.size / 2));
  for (let t = 0; t < 12; t++) {
    const angle = (t * Math.PI) / 3;
    const d = (t / 12) * r;
    putPixel(
      pixels,
      Math.round(eye.x + Math.cos(angle) * d),
      Math.round(eye.y + Math.sin(angle) * d),
      "primary",
    );
  }
}

const EYE_RENDERERS: Record<EyeShape, (pixels: Pixel[], eye: Eye) => void> = {
  dot: renderDotEye,
  line: renderLineEye,
  arc: renderArcEye,
  closed: renderClosedEye,
  cross: renderCrossEye,
  star: renderStarEye,
  hollow: renderHollowEye,
  spiral: renderSpiralEye,
};

// --- Mouth renderers ---

function renderFlatMouth(pixels: Pixel[], mouth: Mouth): void {
  const half = Math.round(mouth.width / 2);
  putHLine(
    pixels,
    mouth.x - half,
    mouth.x + half,
    Math.round(mouth.y),
    "primary",
  );
}

function renderSmileMouth(pixels: Pixel[], mouth: Mouth): void {
  const half = Math.round(mouth.width / 2);
  // top line
  putHLine(
    pixels,
    mouth.x - half,
    mouth.x + half,
    Math.round(mouth.y),
    "primary",
  );
  // curve down
  const depth = Math.max(
    1,
    Math.round(Math.abs(mouth.curve) * mouth.width * 0.3),
  );
  for (let d = 1; d <= depth; d++) {
    const shrink = Math.round((d / depth) * half * 0.8);
    putHLine(
      pixels,
      mouth.x - half + shrink,
      mouth.x + half - shrink,
      Math.round(mouth.y) + d,
      "primary",
    );
  }
}

function renderSadMouth(pixels: Pixel[], mouth: Mouth): void {
  const half = Math.round(mouth.width / 2);
  putHLine(
    pixels,
    mouth.x - half,
    mouth.x + half,
    Math.round(mouth.y),
    "primary",
  );
  const depth = Math.max(
    1,
    Math.round(Math.abs(mouth.curve) * mouth.width * 0.3),
  );
  for (let d = 1; d <= depth; d++) {
    const shrink = Math.round((d / depth) * half * 0.8);
    putHLine(
      pixels,
      mouth.x - half + shrink,
      mouth.x + half - shrink,
      Math.round(mouth.y) - d,
      "primary",
    );
  }
}

function renderOpenMouth(pixels: Pixel[], mouth: Mouth): void {
  const half = Math.round(mouth.width / 2);
  const depth = Math.max(1, Math.round(mouth.width * 0.25));
  for (let dy = 0; dy <= depth; dy++) {
    const shrink = Math.round((dy / depth) * half * 0.4);
    putHLine(
      pixels,
      mouth.x - half + shrink,
      mouth.x + half - shrink,
      Math.round(mouth.y) + dy,
      "primary",
    );
  }
}

function renderWaveMouth(pixels: Pixel[], mouth: Mouth): void {
  const half = Math.round(mouth.width / 2);
  for (let dx = -half; dx <= half; dx++) {
    const wave = Math.round(Math.sin((dx / half) * Math.PI) * mouth.curve * 3);
    putPixel(pixels, mouth.x + dx, Math.round(mouth.y) + wave, "primary");
  }
}

function renderBrokenMouth(pixels: Pixel[], mouth: Mouth): void {
  const half = Math.round(mouth.width / 2);
  // left half
  putHLine(pixels, mouth.x - half, mouth.x - 1, Math.round(mouth.y), "primary");
  // right half, slightly offset
  putHLine(
    pixels,
    mouth.x + 1,
    mouth.x + half,
    Math.round(mouth.y) + 1,
    "primary",
  );
  // wobble
  const depth = Math.max(
    1,
    Math.round(Math.abs(mouth.curve) * mouth.width * 0.15),
  );
  for (let d = 1; d <= depth; d++) {
    putPixel(pixels, Math.round(mouth.x), Math.round(mouth.y) + d, "primary");
  }
}

function renderTinyOMouth(pixels: Pixel[], mouth: Mouth): void {
  const r = Math.max(1, Math.round(mouth.width * 0.15));
  putCircle(pixels, mouth.x, mouth.y + r, r, "primary", false);
}

function renderHiddenMouth(_pixels: Pixel[], _mouth: Mouth): void {
  // no-op
}

const MOUTH_RENDERERS: Record<
  MouthShape,
  (pixels: Pixel[], mouth: Mouth) => void
> = {
  flat: renderFlatMouth,
  smile: renderSmileMouth,
  sad: renderSadMouth,
  open: renderOpenMouth,
  wave: renderWaveMouth,
  broken: renderBrokenMouth,
  tiny_o: renderTinyOMouth,
  hidden: renderHiddenMouth,
};

// --- Mark renderers ---

function renderSweatMark(pixels: Pixel[], mark: Mark): void {
  // simple teardrop: vertical line + bottom dot
  const h = Math.max(1, Math.round(mark.intensity * 4));
  for (let dy = 0; dy < h; dy++) {
    putPixel(pixels, Math.round(mark.x), Math.round(mark.y) + dy, "accent");
  }
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y) + h, "accent");
}

function renderQuestionMark(pixels: Pixel[], mark: Mark): void {
  // ? shape: dot + curve + dot below
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y), "accent");
  putPixel(pixels, Math.round(mark.x) + 1, Math.round(mark.y), "accent");
  putPixel(pixels, Math.round(mark.x) + 1, Math.round(mark.y) + 1, "accent");
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y) + 2, "accent");
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y) + 4, "accent");
}

function renderExclamationMark(pixels: Pixel[], mark: Mark): void {
  for (let dy = 0; dy < 3; dy++) {
    putPixel(pixels, Math.round(mark.x), Math.round(mark.y) + dy, "accent");
  }
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y) + 4, "accent");
}

function renderHeartMark(pixels: Pixel[], mark: Mark): void {
  putPixel(pixels, Math.round(mark.x) - 1, Math.round(mark.y), "accent");
  putPixel(pixels, Math.round(mark.x) + 1, Math.round(mark.y), "accent");
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y) + 1, "accent");
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y) + 2, "accent");
}

function renderSparkleMark(pixels: Pixel[], mark: Mark): void {
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y), "accent");
  putPixel(pixels, Math.round(mark.x) - 1, Math.round(mark.y), "shadow");
  putPixel(pixels, Math.round(mark.x) + 1, Math.round(mark.y), "shadow");
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y) - 1, "shadow");
  putPixel(pixels, Math.round(mark.x), Math.round(mark.y) + 1, "shadow");
}

function renderSmokeMark(pixels: Pixel[], mark: Mark): void {
  for (let dy = 0; dy < 3; dy++) {
    const offset = dy % 2 === 0 ? 0 : 1;
    putPixel(
      pixels,
      Math.round(mark.x) + offset,
      Math.round(mark.y) - dy,
      "shadow",
    );
  }
}

function renderAngerMark(pixels: Pixel[], mark: Mark): void {
  // cross / anger vein
  for (let d = 0; d < 3; d++) {
    putPixel(pixels, Math.round(mark.x) + d, Math.round(mark.y) - d, "primary");
  }
  for (let d = 0; d < 3; d++) {
    putPixel(
      pixels,
      Math.round(mark.x) + d,
      Math.round(mark.y) - d + 2,
      "shadow",
    );
  }
}

function renderEllipsisMark(pixels: Pixel[], mark: Mark): void {
  for (let dx = 0; dx < 3; dx++) {
    putPixel(pixels, Math.round(mark.x) + dx * 2, Math.round(mark.y), "shadow");
  }
}

const MARK_RENDERERS: Record<MarkType, (pixels: Pixel[], mark: Mark) => void> =
  {
    sweat: renderSweatMark,
    question: renderQuestionMark,
    exclamation: renderExclamationMark,
    heart: renderHeartMark,
    sparkle: renderSparkleMark,
    smoke: renderSmokeMark,
    anger: renderAngerMark,
    ellipsis: renderEllipsisMark,
  };

// --- Main render ---

export function renderExpression(expression: EmotileExpression): PixelFrame {
  const { width, height } = expression.canvas;
  const pixels: Pixel[] = [];

  // Render eyes
  const eyeRenderer = EYE_RENDERERS[expression.eyes.left.shape] ?? renderDotEye;
  eyeRenderer(pixels, expression.eyes.left);
  const rightRenderer =
    EYE_RENDERERS[expression.eyes.right.shape] ?? renderDotEye;
  rightRenderer(pixels, expression.eyes.right);

  // Render mouth
  const mouthRenderer =
    MOUTH_RENDERERS[expression.mouth.shape] ?? renderFlatMouth;
  mouthRenderer(pixels, expression.mouth);

  // Render brows
  if (expression.brows) {
    if (expression.brows.left) {
      const brow = expression.brows.left;
      const half = Math.round((brow.length ?? 4) / 2);
      const angleRad = ((brow.angle ?? 0) * Math.PI) / 180;
      for (let d = -half; d <= half; d++) {
        const px = Math.round(expression.eyes.left.x + d * Math.cos(angleRad));
        const py = Math.round(brow.y + d * Math.sin(angleRad));
        putPixel(pixels, px, py, "primary");
      }
    }
    if (expression.brows.right) {
      const brow = expression.brows.right;
      const half = Math.round((brow.length ?? 4) / 2);
      const angleRad = ((brow.angle ?? 0) * Math.PI) / 180;
      for (let d = -half; d <= half; d++) {
        const px = Math.round(expression.eyes.right.x + d * Math.cos(angleRad));
        const py = Math.round(brow.y + d * Math.sin(angleRad));
        putPixel(pixels, px, py, "primary");
      }
    }
  }

  // Render marks
  if (expression.marks) {
    for (const mark of expression.marks) {
      const renderer = MARK_RENDERERS[mark.type] ?? renderSparkleMark;
      renderer(pixels, mark);
    }
  }

  // Clip pixels to canvas bounds
  const clipped = pixels.filter(
    (p) => p.x >= 0 && p.x < width && p.y >= 0 && p.y < height,
  );

  // Deduplicate by coordinate — last write wins
  const pixelMap = new Map<string, Pixel>();
  for (const p of clipped) {
    pixelMap.set(`${p.x},${p.y}`, p);
  }
  const deduped = Array.from(pixelMap.values());

  return { width, height, pixels: deduped };
}
