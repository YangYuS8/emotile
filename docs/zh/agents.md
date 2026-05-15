# Agent 协作指南

Emotile 使用两个 Agent 角色：**Architect** 和 **Builder**。

## 角色

**Architect Agent** 负责规划、创建 issue、维护规范、审查 PR、合并已批准的工作并关闭 issue。

**Builder Agent** 负责在功能分支上实现范围内的 issue 并打开 PR。

## 工作流程

```
Issue -> Branch -> PR -> Review -> Merge -> Close
```

## 同账号审查回退

当 Architect 和 Builder 共享 GitHub 账号时，GitHub 不允许对自己 PR 进行正式审查。在这种情况下：

- **首选：** 可用时使用 GitHub 的正式审查 UI。
- **回退：** Architect 在合并或阻止前留下顶级 PR 评论，标题为 `## Architect Review Note`。

## 质量门

PR 被接受前，应通过：

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## 项目原则

- Emotile 是平台无关的表达式语言/运行时，不是桌面宠物或预设表情包。
- 不要添加完整的预设表达式如 `happy_01`。
- 优先使用可组合的视觉原语。
- 面向 Agent 的输入必须可验证、可归一化、可修复。
- 渲染器更改不能削弱模式保证。
- 保持 v0.1 平台无关：无浏览器、Canvas、GPU、窗口管理器或桌面宠物运行时依赖。

完整规则请参见 [`AGENTS.md`](https://github.com/YangYuS8/emotile/blob/main/AGENTS.md)。
