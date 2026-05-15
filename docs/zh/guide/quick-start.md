# 快速开始

## 安装

```bash
npm install @yangyus8/emotile
```

## 基本用法

```ts
import {
  validateExpression,
  normalizeExpression,
  repairExpression,
  renderExpression,
  renderPixelFrameToASCII,
} from "@yangyus8/emotile";

// 1. 定义表达式
const expression = {
  version: "0.1",
  canvas: { width: 32, height: 32 },
  face: { shape: "none", tilt: 0, squash: 0 },
  eyes: {
    left: { shape: "dot", x: 10, y: 12, size: 3, openness: 1 },
    right: { shape: "dot", x: 21, y: 12, size: 3, openness: 1 },
  },
  mouth: { shape: "smile", x: 16, y: 22, width: 6, curve: 0.4 },
  motion: { blink: 0, jitter: 0, breath: 0, shake: 0, glitch: 0 },
  mutation: { asymmetry: 0, randomness: 0, glitch: 0 },
};

// 2. 验证
const result = validateExpression(expression);
if (!result.ok) {
  console.log("错误:", result.errors);
}

// 3. 归一化（填充默认值，钳位数值）
const normalized = normalizeExpression(expression);

// 4. 渲染
const frame = renderExpression(normalized);
console.log(`${frame.width}x${frame.height}, ${frame.pixels.length} 像素`);

// 5. 调试预览
const ascii = renderPixelFrameToASCII(frame);
console.log(ascii);
```

## 修复无效输入

```ts
const { value, warnings } = repairExpression(malformedInput);
console.log("修复后:", value);
console.log("警告:", warnings);
```

## SVG 渲染

无需浏览器或 Canvas 即可将像素帧导出为 SVG 字符串：

```ts
import { renderPixelFrameToSVG, normalizeTheme } from "@yangyus8/emotile";

const theme = normalizeTheme({ primary: "#1a1a2e", accent: "#e94560" });
const svg = renderPixelFrameToSVG(frame, { theme, pixelSize: 10 });
console.log(svg);
```

## 轻量 CLI

如果你更倾向使用 shell 命令而非 JavaScript 导入：

```bash
# 验证并修复
emotile repair input.json > safe.json

# ASCII 预览
emotile preview safe.json

# 渲染 SVG
emotile render svg safe.json > output.svg
```

## JSON Schema 结构化生成

使用导出的 JSON Schema 约束 LLM 的结构化输出：

```ts
import { getExpressionSchema } from "@yangyus8/emotile";

const schema = getExpressionSchema();
// 将 schema 作为结构化输出约束传递给 LLM 客户端
```
