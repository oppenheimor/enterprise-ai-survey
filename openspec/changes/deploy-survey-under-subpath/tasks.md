## 1. 规格与路径约束

- [x] 1.1 补齐子路径部署的 proposal、design、specs，并通过 `openspec validate` 校验产物格式
- [x] 1.2 补一份 `docs/plans` 设计文档，记录子路径部署的目标、影响面、风险与部署策略

## 2. 项目代码改造

- [x] 2.1 在 Next.js 配置中启用 `/enterprise-ai-survey` 子路径，并增加统一路径工具
- [x] 2.2 修复页面跳转、客户端 API 请求、缓存失效路径与静态资源引用，使其与子路径一致
- [x] 2.3 调整 E2E 与相关测试入口，确保验证针对新正式路径

## 3. 部署与验证

- [x] 3.1 重新构建并验证本地项目在子路径下可正常运行
- [x] 3.2 更新服务器 Nginx 配置并重新部署应用
- [x] 3.3 验证 `/enterprise-ai-survey`、`/enterprise-ai-survey/dashboard` 和 `/enterprise-ai-survey/api/survey/analysis` 可访问

## 4. 文档沉淀

- [ ] 4.1 将本次子路径部署的真实变更点和验收命令补充到 `docs/deployment`
