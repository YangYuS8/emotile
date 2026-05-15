# 发布流程

本文档描述 Emotile 的发布如何准备、检查、触发、重试与复查，涵盖 Architect 与 Builder 的职责边界，以及手动发布的具体步骤。

## 角色分工

Emotile 使用两个 Agent 角色，发布权限在两者之间拆分。

### Builder

- 可以在 feature branch 上实现发布自动化、测试、文档和修复。
- 任何与发布相关的改动都必须通过 PR 提交。
- **禁止**触发正式 release workflow。
- **禁止**合并发布相关的 PR。
- **禁止**创建 git tag 或 GitHub Release。
- **禁止**发布到 npm。

### Architect

- 审查并合并发布相关的 PR。
- 通过 `workflow_dispatch` 触发正式 release workflow。
- 对 `package.json` 和 `CHANGELOG.md` 中声明的版本负最终责任。
- 仅通过已审批的 workflow 创建 git tag 和 GitHub Release。
- 在部分失败后判断是否安全重试。

## Workflows

### Release Preflight

`.github/workflows/release-preflight.yml`

每个指向 `main` 的 PR 自动运行，也可通过 `workflow_dispatch` 手动触发。

Preflight 检查项：

1. `package.json` 版本与 `CHANGELOG.md` 对应。
2. `pnpm typecheck` 通过。
3. `pnpm test` 通过。
4. `pnpm build` 通过。
5. `pnpm docs:build` 通过。
6. `pnpm pack --dry-run` 成功。
7. CLI smoke test（`emotile validate examples/shy.json`）。
8. Library import smoke test（`dist/index.js` 公共 API）。

Preflight 是只读的，不发布、不打 tag、不创建 release。

### Manual Release

`.github/workflows/release.yml`

仅通过 `workflow_dispatch` 触发。Architect 输入版本号（例如 `0.4.0`）。

执行步骤：

1. 验证 `package.json` 版本与输入一致。
2. 验证 `CHANGELOG.md` 包含该版本的章节。
3. 运行完整质量门禁（typecheck、test、build、docs:build、pack dry-run）。
4. 从 `CHANGELOG.md` 提取 release notes。
5. 发布到 npm（优先 OIDC；`NPM_TOKEN` fallback）。
6. 创建 git tag `vX.Y.Z`。
7. 创建 GitHub Release，使用 `CHANGELOG.md` 中的 notes。

## Architect 发布检查清单

触发 release workflow 之前：

- [ ] `package.json` 版本正确且已提交到 `main`。
- [ ] `CHANGELOG.md` 包含目标版本的章节。
- [ ] 最新 `main` commit 的 CI 全部通过。
- [ ] 最新 `main` commit 的 Release Preflight 通过。
- [ ] 本地 docs build 通过。
- [ ] 计划在本版本完成的所有 issue 已合并并关闭。
- [ ] npm Trusted Publishing 已配置，或 `NPM_TOKEN` secret 已设置。

Workflow 完成后：

- [ ] npm 上能看到新版本。
- [ ] git tag `vX.Y.Z` 已存在。
- [ ] GitHub Release 已创建且 notes 正确。
- [ ] 文档站点已更新（如适用）。

## Builder 对发布相关 PR 的要求

提交发布自动化相关 PR 时：

1. 使用 `Closes #issue` 关联对应 issue。
2. 列出验证命令及结果。
3. 注明无法在本地测试的内容（如 workflow dispatch 接线、实际 npm publish、tag 创建）。
4. 显式列出剩余风险。
5. 不要触发 release workflow。

## 失败处理与重试规则

### 任何发布副作用发生前的失败

如果 workflow 在检查阶段失败（版本不匹配、测试失败、构建失败、文档失败、pack dry-run 失败）：

- 在 feature branch 上修复问题。
- 提交 PR。
- 合并后重新运行 release workflow。

此时没有 tag、release 或 publish 发生，重试是安全的。

### Publish 成功但 tag 创建失败

如果 npm publish 成功但 tag 创建失败：

- 该版本已存在于 npm。
- **不要**用相同版本重新运行 workflow，因为 `pnpm publish` 会失败（版本已存在）。
- 手动创建 git tag 和 GitHub Release，或提升版本号以 patch release 重试。

### Tag 创建成功但 GitHub Release 失败

如果 tag 已创建但 GitHub Release 步骤失败：

- tag 已存在且包已发布到 npm。
- 手动创建 GitHub Release，使用 `gh release create` 或 GitHub Web UI。
- 使用 `CHANGELOG.md` 中的同一份 release notes。

### 部分 publish 失败（OIDC 失败，fallback 成功）

如果 OIDC publish 失败但 `NPM_TOKEN` fallback 成功：

- 发布有效，但可能缺少 npm provenance。
- 记录 OIDC 失败原因以便后续排查。
- 除非 provenance 对该版本至关重要，否则不要重试。

## npm Trusted Publishing / OIDC 配置

Emotile 优先使用 npm Trusted Publishing（OIDC），而非长期 token。

### 在 npm 上配置

1. 打开 npm 包页面：`https://www.npmjs.com/package/@yangyus8/emotile`。
2. 进入 **Publishing access & 2FA** > **Trusted Publishers**。
3. 添加新的 trusted publisher：
   - **Publisher type**：GitHub Actions
   - **Repository**：`YangYuS8/emotile`
   - **Workflow name**：`release.yml`

### Workflow 需要的权限

Release workflow 请求两个权限：

- `contents: write` — 推送 git tag 和创建 GitHub Release。
- `id-token: write` — 与 npm 交换短期 OIDC token。

Trusted Publishing 生效后，不再需要 `NPM_TOKEN` secret。

## NPM_TOKEN Fallback

如果 Trusted Publishing 尚未配置，workflow 会回退到经典的 npm automation token。

1. 在 npm 上生成 **automation token**（Account > Access Tokens > Generate New Token > Automation）。
2. 将其作为名为 `NPM_TOKEN` 的 repository secret 添加。
3. 如果 OIDC publish 失败，workflow 会自动使用它。

Fallback 路径在 workflow YAML 中清晰分离。早期发布可以使用，但应尽快替换为 Trusted Publishing。

## Release Notes 来源

Release notes 始终从 `CHANGELOG.md` 提取。workflow 使用 `scripts/extract-release-notes.mjs` 拉取目标版本的章节。

如果 `CHANGELOG.md` 不包含目标版本，workflow 会在任何副作用发生前失败。

## 参考

- [AGENTS.md](https://github.com/YangYuS8/emotile/blob/main/AGENTS.md) — 角色定义与权限
- [docs/v0.4-plan.md](/v0.4-plan.md) — 发布自动化规划
- [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)
