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
