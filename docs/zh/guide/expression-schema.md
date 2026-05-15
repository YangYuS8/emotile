# 表达式结构

Emotile 表达式是一个 JSON 对象，具有以下结构：

## 顶层字段

| 字段     | 必需 | 描述                          |
|----------|------|-------------------------------|
| version  | 是   | 必须是 `"0.1"`                |
| canvas   | 是   | v0.1 固定为 32×32            |
| face     | 是   | 形状、倾斜、压扁              |
| eyes     | 是   | 左眼和右眼定义                |
| mouth    | 是   | 嘴巴形状和位置                |
| brows    | 否   | 左眉和右眉定义                |
| marks    | 否   | 装饰符号数组                  |
| motion   | 否   | 动画参数                      |
| mutation | 否   | 变异/变化参数                 |

## 画布

v0.1 使用**固定 32×32 画布**。`canvas` 字段为向前兼容而必需，但 `width` 和 `height` 必须都为 `32`。

## 脸部

| 字段   | 类型   | 默认值   | 可选值                    |
|--------|--------|----------|---------------------------|
| shape  | string | `"none"` | `"none"`, `"circle"`, `"soft_square"` |
| tilt   | number | 0        | -15 到 15                 |
| squash | number | 0        | -0.3 到 0.3               |

## 眼睛

每只眼睛具有：

| 字段     | 类型   | 默认值  | 范围 / 可选值                                      |
|----------|--------|---------|-----------------------------------------------------|
| shape    | string | `"dot"` | `"dot"`, `"line"`, `"arc"`, `"closed"`, `"cross"`, `"star"`, `"hollow"`, `"spiral"` |
| x        | number | —       | 0–31                                                |
| y        | number | —       | 0–31                                                |
| size     | number | 3       | 1–8                                                 |
| openness | number | 1       | 0–1                                                 |
| angle    | number | —       | -180 到 180（可选）                                 |

## 嘴巴

| 字段  | 类型   | 默认值    | 范围 / 可选值                                      |
|-------|--------|-----------|-----------------------------------------------------|
| shape | string | `"flat"`  | `"flat"`, `"smile"`, `"sad"`, `"open"`, `"wave"`, `"broken"`, `"tiny_o"`, `"hidden"` |
| x     | number | 16        | 0–31                                                |
| y     | number | 22        | 0–31                                                |
| width | number | 6         | 1–16                                                |
| curve | number | 0         | -1 到 1                                             |

## 标记

| 字段      | 类型   | 默认值 | 范围 / 可选值                                      |
|-----------|--------|--------|-----------------------------------------------------|
| type      | string | —      | `"sweat"`, `"question"`, `"exclamation"`, `"heart"`, `"sparkle"`, `"smoke"`, `"anger"`, `"ellipsis"` |
| x         | number | —      | 0–31                                                |
| y         | number | —      | 0–31                                                |
| intensity | number | —      | 0–1                                                 |

## 运动与变异

两者都是可选对象，数值字段范围为 0–1：

- **运动：** `blink`, `jitter`, `breath`, `shake`, `glitch`
- **变异：** `asymmetry`, `randomness`, `glitch`
