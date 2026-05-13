# Emotile

Emotile 是一个面向 AI Agent 的像素表情语法与运行时。

它不要求开发者提前绘制大量完整表情包，也不让 agent 直接控制每一个像素，而是通过眼睛、嘴巴、眉毛、符号、动作和变异参数，组成可读、可校验、可渲染的像素表情。

运行时负责校验、修复、归一化和渲染，将表达式输出为一个小型像素面孔。

[English](README.md)

## 为什么不用预定义表情包？

预定义表情（如 `happy_01`、`sad_02`）只能提供固定目录中的内容，agent 只能表达目录中已有的表情。而视觉原语是可组合的——agent 可以表达"骄傲但略带担忧"或"困惑但正在努力"，无需任何人预先绘制出这个精确表情。

## 为什么不让 Agent 直接控制像素？

直接像素控制使校验变得不可能，微小误差就会产生不可辨识的面孔，同时破坏了动画、缩放和主题化的结构保证。Emotile 的约束语法在给予 agent 足够灵活性的同时，确保输出始终结构合法。

## 当前阶段

**v0.1** — 最小可用库。以纯数据形式完成校验、归一化、修复、渲染和变异。不依赖浏览器、Canvas 或 GPU。

## 最简表达式示例

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "smile", "x": 16, "y": 22, "width": 6, "curve": 0.4 },
  "motion": { "blink": 0, "jitter": 0, "breath": 0, "shake": 0, "glitch": 0 },
  "mutation": { "asymmetry": 0, "randomness": 0, "glitch": 0 }
}
```

## API

```ts
import {
  validateExpression,
  normalizeExpression,
  repairExpression,
  renderExpression,
  mutateExpression,
} from "emotile";

// 校验 — 检查表达式是否结构合法
const result = validateExpression(input);
if (result.ok) {
  console.log("合法!", result.value);
} else {
  console.log("错误:", result.errors);
}

// 归一化 — 填充默认值、钳位数值，总是成功
const normalized = normalizeExpression(input);

// 修复 — 修正无效形状、钳位数值、报告警告
const { value, warnings } = repairExpression(input);

// 渲染 — 生成像素帧（纯数据，无 Canvas 依赖）
const frame = renderExpression(normalized);
console.log(`${frame.width}x${frame.height}, ${frame.pixels.length} 像素`);

// 变异 — 确定性的、基于种子的变化
const mutated = mutateExpression(normalized, { seed: 42, amount: 0.2 });
```

## 运行测试

```bash
pnpm install
pnpm test
```

## 渲染示例

```ts
import { normalizeExpression, renderExpression } from "emotile";
import confused from "./examples/confused.json";

const normalized = normalizeExpression(confused);
const frame = renderExpression(normalized);

frame.pixels.forEach((p) => {
  console.log(`(${p.x}, ${p.y}) = ${p.color}`);
});
```

## 当前限制

- Canvas 实际仅支持 32×32（类型允许最大 256×256）。
- 渲染器输出像素列表，而非 PNG/GIF/SVG——下游消费者需自行转换。
- 尚无动画支持（motion 字段已定义但未实现动画）。
- 尚无主题/调色板支持（颜色为语义化：`primary`、`accent`、`shadow`）。
- 尚无浏览器、终端或游戏引擎集成。

## 路线图

- **v0.2**: 主题支持（调色板）、PNG/SVG 导出、动画帧驱动。
- **v0.3**: 终端渲染器（braille/unicode）、Godot 集成。
- **v0.4**: Agent 友好的 prompt schema、OpenClaw/Hermes 集成钩子。
- **v1.0**: 稳定规范、npm 包、完整动画运行时。

## 许可证

MIT
