# API 参考

## 核心函数

### `validateExpression(input)`

验证表达式对象。返回 `{ ok: true, value }` 或 `{ ok: false, errors }`。

### `normalizeExpression(input)`

用默认值填充缺失字段并钳位超出范围的值。总是返回完整的 `EmotileExpression`。

### `repairExpression(input)`

修复无效形状，钳位数值，填充缺失字段。返回 `{ value, warnings }`。

### `renderExpression(expression)`

将归一化表达式渲染为 `PixelFrame`——一个具有 `width`、`height` 和 `pixels[]` 的纯数据结构。

### `mutateExpression(expression, options)`

生成表达式的确定性变化。

- `options.seed`：用于可重现性的字符串或数字
- `options.amount`：0–1 变化强度

### `renderPixelFrameToASCII(frame)`

将 `PixelFrame` 转换为用于终端调试输出的 ASCII 字符串。

### `tickExpression(expression, tick)`

使用显式整数 tick 将 motion 字段应用到表达式。确定性的——相同的表达式和 tick 总是产生相同的输出。无定时器或副作用。返回可渲染的新表达式。

v0.2 中活跃的 motion 字段：
- `blink` —— 周期性闭眼
- `breath` —— 正弦波 squash 和垂直偏移
- `shake` —— 眼睛和嘴巴的正弦/余弦偏移
- `jitter` —— 确定性随机微动
- `glitch` —— 偶尔的确定性随机形状交换

### `buildExpression(options?)`

从高阶语义选项构建合法、归一化的表达式。所有数值自动钳位；无效枚举选项回退到安全默认值。

示例：
```ts
const expr = buildExpression({
  eyeShape: "arc",
  mouthShape: "smile",
  curve: 0.5,
  marks: ["heart"],
});
```

### `AGENT_GUIDANCE`

AI Agent 生成表达式时推荐的安全范围和约束。包括默认位置、安全数值范围和最大推荐标记数。

### `MINIMAL_EXPRESSION`

一个可安全复制的起始模板，包含所有必填字段，省略可选字段。可直接传递给 `validateExpression`。

### `COMMON_AGENT_MISTAKES`

常见生成错误目录及 `repairExpression` 的修复方式。用于自我纠正 Agent 输出。

## 类型

关键导出类型：

- `EmotileExpression` —— 顶层表达式对象
- `PixelFrame` —— 渲染输出
- `Pixel` —— 具有 `x`、`y`、`color` 的单个像素
- `ValidationResult<T>` —— 验证结果类型
- `RepairResult` —— 修复结果类型

## 模式常量

从 `schema` 导出：

- `FACE_SHAPES`, `EYE_SHAPES`, `MOUTH_SHAPES`, `MARK_TYPES`
- `DEFAULT_EXPRESSION`, `DEFAULT_CANVAS` 等
