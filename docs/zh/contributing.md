# 贡献指南

## Issue → Branch → PR → Review → Merge → Close

所有非平凡更改都必须从 issue 开始。

### Builder Agent

1. 选择一个开放的 issue
2. 创建功能分支：`git checkout -b feat/issue-description`
3. 实现并添加测试
4. 运行质量门：`pnpm typecheck && pnpm test && pnpm build`
5. 打开链接 issue 的 PR，使用 `Closes #issue`
6. 回应审查反馈
7. **不要**合并自己的 PR

### Architect Agent

1. 创建或完善 issue
2. 审查 PR
3. 合并已批准的 PR
4. 关闭 issue

### 质量门

PR 被接受前，应通过：

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

如果更改影响公共行为，请包含测试。
如果更改影响表达式格式，请更新规范。
如果更改影响用户面向的用法，请更新 README。

## 文档更改

- 长期规划属于 `docs/`，而非无限期开放的 issue。
- 开放的 issue 通常应该是 Builder 可执行的任务。
- 规划 issue 应在决策做出后关闭，结论迁移到文档。
- 保持文档简洁。避免企业流程语气。
