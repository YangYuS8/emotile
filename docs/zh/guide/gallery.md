# 图库

这些示例演示了如何从视觉原语组合 Emotile 表达式。它们是学习材料，而非预设目录——Agent 应从原语生成表达式，而非从固定示例中选择。

## 中性表情

简单的中性表情，使用点状眼睛和平直嘴巴。

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "flat", "x": 16, "y": 22, "width": 6, "curve": 0 }
}
```

## 开心

弧形眼睛、微笑嘴巴和上挑眉毛。

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "circle", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "arc", "x": 10, "y": 12, "size": 4, "openness": 0.8 },
    "right": { "shape": "arc", "x": 21, "y": 12, "size": 4, "openness": 0.8 }
  },
  "mouth": { "shape": "smile", "x": 16, "y": 23, "width": 8, "curve": 0.5 },
  "brows": {
    "left": { "angle": -15, "y": 8, "length": 4 },
    "right": { "angle": 15, "y": 8, "length": 4 }
  }
}
```

## 担忧

抬高的眉毛、微张的嘴巴和汗滴标记。

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "soft_square", "tilt": 3, "squash": 0.1 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 0.9 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 0.9 }
  },
  "mouth": { "shape": "open", "x": 16, "y": 22, "width": 5, "curve": -0.2 },
  "brows": {
    "left": { "angle": 25, "y": 8, "length": 4 },
    "right": { "angle": -25, "y": 8, "length": 4 }
  },
  "marks": [
    { "type": "sweat", "x": 25, "y": 8, "intensity": 0.7 }
  ]
}
```

## 动画示例

此表达式使用 motion 字段，通过 `tickExpression` 生成动画。

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "closed", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "closed", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "smile", "x": 16, "y": 22, "width": 6, "curve": 0.3 },
  "motion": { "blink": 0.8, "breath": 0.4, "shake": 0, "jitter": 0, "glitch": 0 }
}
```

## 主题示例

使用 `applyTheme` 和 `renderPixelFrameToSVG` 以不同调色板渲染相同表达式。

```ts
import { buildExpression, renderExpression, applyTheme, renderPixelFrameToSVG } from "@yangyus8/emotile";

const expr = buildExpression({ eyeShape: "star", mouthShape: "wave", marks: ["heart"] });
const frame = renderExpression(expr);

// 柔和主题
const pastel = applyTheme(frame, { theme: { primary: "#a8d8ea", accent: "#fcbad3", shadow: "#ffffd2" } });

// 深色主题
const dark = applyTheme(frame, { theme: { primary: "#e0e0e0", accent: "#ff6b6b", shadow: "#4ecdc4", background: "#1a1a2e" } });

// 使用深色主题和背景导出 SVG
const svg = renderPixelFrameToSVG(frame, { theme: dark.theme, background: true, pixelSize: 16 });
```

## 变异示例

此表达式使用变异字段创建细微的确定性变化。

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "smile", "x": 16, "y": 22, "width": 6, "curve": 0.3 },
  "mutation": { "asymmetry": 0.3, "randomness": 0.2, "glitch": 0 }
}
```

使用 `mutateExpression(expr, { seed: 42, amount: 0.3 })` 应用受控变化，同时保持表达式合法且可渲染。

## 不是预设目录

这些示例通过组合原语展示了可能性。Agent 应通过调整各个字段——眼睛形状、嘴巴形状、位置、运动、变异——来生成表达式，而非从固定列表中选择。这保留了原语系统的完整表达范围。
