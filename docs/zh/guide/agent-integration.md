# Agent 集成指南

本文档展示下游 Agent 如何使用现有 v0.3 公共 API 生成和处理 Emotile 表达式。

Emotile 是一个平台无关的表达式语言。任何能运行 JavaScript 或调用 CLI 的宿主都可以使用它，包括 OpenClaw、Hermes 或自定义 Agent 框架。本文档不依赖任何特定宿主。

## 使用 JSON Schema 进行结构化生成

Emotile 导出一个与 TypeScript 类型对应的手写 JSON Schema：

```typescript
import { getExpressionSchema, EMOTILE_EXPRESSION_SCHEMA } from "@yangyus8/emotile";

const schema = getExpressionSchema(); // 深拷贝，可安全修改
```

在要求 LLM 输出结构化 JSON 时，可将此 Schema 作为约束条件。Schema 定义了：

- 必填字段（`version`、`canvas`、`face`、`eyes`、`mouth`）
- 形状的有效枚举值
- 坐标、尺寸、强度的数值范围

::: warning Schema 是引导，不是保证
即使给 LLM 提供了 JSON Schema，其输出仍可能包含：

- 超出范围的数值
- 无效的枚举字符串
- 缺失的字段
- 类型不匹配

**生成后务必执行验证与修复。**
:::

## 推荐链路

从生成的候选表达式到渲染输出的最安全路径：

```
生成候选表达式
    |
    v
validateExpression() ── 无效? ──> repairExpression()
    |                                 |
    v                                 v
normalizeExpression() <─────────────┘
    |
    v
renderExpression() ──> PixelFrame（语义颜色）
    |
    +---> renderPixelFrameToSVG({ theme }) ──> SVG 字符串
    |
    +---> applyTheme() ──> ThemedFrame（具体颜色）

```

### 1. 生成

使用 JSON Schema 或模板生成候选 `EmotileExpression`。

```typescript
import { MINIMAL_EXPRESSION } from "@yangyus8/emotile";

// 从最小模板开始并自定义
const candidate = {
  ...MINIMAL_EXPRESSION,
  face: { shape: "circle", tilt: 2, squash: -0.05 },
  eyes: {
    left: { shape: "arc", x: 10, y: 12, size: 4, openness: 0.8 },
    right: { shape: "arc", x: 21, y: 12, size: 4, openness: 0.8 },
  },
  mouth: { shape: "smile", x: 16, y: 22, width: 6, curve: 0.3 },
};
```

### 2. 验证与修复

```typescript
import { validateExpression, repairExpression } from "@yangyus8/emotile";

const validation = validateExpression(candidate);
if (!validation.ok) {
  console.warn("验证错误:", validation.errors);
}

const repair = repairExpression(candidate);
if (repair.warnings.length > 0) {
  console.warn("修复警告:", repair.warnings);
}
const safeExpression = repair.value; // 始终有效
```

`repairExpression` 是确定性的。它会钳制范围、填充缺失字段，并将无效枚举替换为安全默认值。

### 3. 规范化

```typescript
import { normalizeExpression } from "@yangyus8/emotile";

const normalized = normalizeExpression(safeExpression);
```

规范化会用默认值填充可选字段，确保表达式在渲染前处于标准形式。

### 4. 渲染

```typescript
import { renderExpression } from "@yangyus8/emotile";

const frame = renderExpression(normalized); // PixelFrame
```

`renderExpression` 生成一个 `PixelFrame`——一个纯数据的 32×32 网格，使用语义颜色（`primary`、`accent`、`shadow`、`transparent`）。

### 5. 主题与 SVG（可选）

`renderPixelFrameToSVG` 直接接受语义 `PixelFrame`，并通过 `theme` 选项在内部映射颜色：

```typescript
import { normalizeTheme, renderPixelFrameToSVG } from "@yangyus8/emotile";

const theme = normalizeTheme({
  primary: "#1a1a2e",
  accent: "#e94560",
  shadow: "#533483",
});

const svg = renderPixelFrameToSVG(frame, {
  theme,
  pixelSize: 10,
  background: true,
});
```

如果你需要具体的像素数据而不是 SVG 字符串，使用 `applyTheme`：

```typescript
import { applyTheme } from "@yangyus8/emotile";

const themedFrame = applyTheme(frame, { theme });
// themedFrame 包含每个像素的具体 hex 颜色
```

`renderPixelFrameToSVG` 返回一个纯 SVG 字符串。不需要浏览器、Canvas、GPU 或文件系统依赖。

## 完整 TypeScript 示例

```typescript
import {
  getExpressionSchema,
  validateExpression,
  repairExpression,
  normalizeExpression,
  renderExpression,
  normalizeTheme,
  applyTheme,
  renderPixelFrameToSVG,
  MINIMAL_EXPRESSION,
} from "@yangyus8/emotile";

function generateAndRender(candidate: unknown): string {
  // 1. 验证与修复
  const repair = repairExpression(candidate);
  if (repair.warnings.length > 0) {
    console.warn("已修复表达式:", repair.warnings);
  }

  // 2. 规范化
  const normalized = normalizeExpression(repair.value);

  // 3. 渲染为像素帧
  const frame = renderExpression(normalized);

  // 4. 使用主题导出为 SVG
  const theme = normalizeTheme();
  return renderPixelFrameToSVG(frame, { theme, pixelSize: 10 });
}

// 示例用法
const svgString = generateAndRender({
  ...MINIMAL_EXPRESSION,
  face: { shape: "circle", tilt: 1, squash: 0 },
  mouth: { shape: "smile", x: 16, y: 22, width: 6, curve: 0.2 },
});
```

## 与 Agent 宿主集成

本指南直接使用 Emotile 包 API。如果你要将 Emotile 集成到 OpenClaw 或 Hermes 等 Agent 宿主中：

- 使用 JSON Schema（`getExpressionSchema()`）作为结构化输出约束。
- 将生成的 JSON 通过上述验证 / 修复 / 规范化 / 渲染链路处理。
- 将生成的 SVG 字符串传递给宿主的显示层。

不需要运行时耦合。Emotile 保持平台无关。

## CLI 替代方案

如果你的宿主环境更倾向使用 shell 命令而非 JavaScript 导入：

```bash
# 验证并修复生成的表达式
emotile repair generated.json > safe.json

# ASCII 预览
emotile preview safe.json

# 渲染为 SVG
emotile render svg safe.json > output.svg
```

CLI 使用与库相同的代码，产生相同的确定性输出。

## 参考

- [Agent 指南](/zh/guide/agent-guidance) — 安全范围与常见错误
- [表达式结构](/zh/guide/expression-schema) — 完整字段参考
- [API 文档](/zh/api/) — 完整函数签名
