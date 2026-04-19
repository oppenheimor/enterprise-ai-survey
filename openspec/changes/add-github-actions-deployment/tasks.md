## 1. 规格与设计

- [x] 1.1 创建 GitHub Actions 自动部署的 proposal、design 和 spec
- [x] 1.2 通过 OpenSpec 校验确认变更产物格式正确

## 2. GitHub Actions 实现

- [x] 2.1 新增生产部署 workflow，支持 `main` push 和手动触发
- [x] 2.2 在 workflow 中增加基线检查、SSH 准备、远程部署、分层验收和 job summary

## 3. 凭据与服务器授权

- [x] 3.1 创建 GitHub Actions 专用 SSH key，并把公钥加入服务器 `ubuntu` 用户授权
- [x] 3.2 写入 GitHub repository secrets，供 workflow 使用

## 4. 文档与验证

- [x] 4.1 更新部署文档，记录自动部署流程、Secrets、服务器 `.env` 策略和排障方式
- [x] 4.2 本地运行项目基线检查和 OpenSpec 校验
- [ ] 4.3 提交并 push 到 `main`，确认 GitHub Actions 可见且生产入口通过验收
