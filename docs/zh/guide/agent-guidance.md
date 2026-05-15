# Agent 指南

本指南帮助 AI Agent 生成有效、富有表现力的 Emotile 表达式。

## 最小有效表达式

```json
{
  "version": "0.1",
  "canvas": { "width": 32, "height": 32 },
  "face": { "shape": "none", "tilt": 0, "squash": 0 },
  "eyes": {
    "left": { "shape": "dot", "x": 10, "y": 12, "size": 3, "openness": 1 },
    "right": { "shape": "dot", "x": 21, "y": 12, "size": 3, "openness": 1 }
  },
  "mouth": { "shape": "flat", "x": 16, "y": 22, "width": 6, "curve": 0 },
  "motion": { "blink": 0, "jitter": 0, "breath": 0, "shake": 0, "glitch": 0 },
  "mutation": { "asymmetry": 0, "randomness": 0, "glitch": 0 }
}
```

## 常见可修复错误

- 无效的眼睛/嘴巴形状 → 修复为 `"dot"` / `"flat"`
- 超出范围的值 → 钳位到有效范围
- 缺失字段 → 填充默认值
- 非对象标记数组元素 → 过滤掉

## 推荐生成约束

- `tilt` 保持较小（-5 到 5）以获得微妙表情
- `curve` 在 -0.5 到 0.5 之间以获得自然嘴形
- `openness` < 0.3 创建困倦/闭合的眼睛
- 最多添加 1–2 个标记以避免杂乱

## 工作流程

1. **生成**表达式对象
2. 使用 `validateExpression()` **验证**
3. 如果无效，使用 `repairExpression()` **修复**
4. 渲染前使用 `normalizeExpression()` **归一化**
5. 使用 `renderExpression()` **渲染**

## 确定性变异

使用 `mutateExpression(expression, { seed, amount })` 进行受控变化：
- `seed` 确保可重现的输出
- `amount` 控制变化强度（0–1）
