# 腾讯云单机 Web 项目首发部署模板

## 文档目标

本文档用于沉淀一套后续可直接复用的首发部署模板，适用于以下类型项目：

1. 单体 Web 项目
2. 单个 Node.js 服务
3. 单数据库项目
4. 首发阶段不需要复杂高可用架构的产品

本模板的核心目标是：

1. 快速上线
2. 尽量少踩坑
3. 避免一开始过度设计

---

## 1. 适用范围

适合本模板的项目通常具备以下特征：

1. 前后端一体或单服务形态
2. 可以先接受单机部署
3. 用户量和并发量处于早期阶段
4. 团队当前更需要验证业务链路，而不是搭基础设施平台

不适合本模板的情况：

1. 强依赖多服务拆分
2. 必须高可用多副本
3. 必须内外网隔离和复杂 VPC 架构
4. 必须容器编排或自动扩缩容

---

## 2. 默认推荐架构

推荐默认首发架构如下：

1. 云产品：`腾讯云 Lighthouse`
2. 操作系统：`Ubuntu LTS`
3. 应用运行：`Node.js`
4. 进程托管：`PM2`
5. Web 入口：`Nginx`
6. 数据库：`PostgreSQL`
7. HTTPS：`腾讯云 SSL 证书 + Nginx`

默认链路如下：

```text
用户 -> 域名 -> Nginx(80/443) -> Node.js 应用(127.0.0.1:3000) -> PostgreSQL(127.0.0.1:5432)
```

---

## 3. 选型模板

### 3.1 云产品选择

默认优先级：

1. 首发：`Lighthouse`
2. 规模增长后：`CVM`
3. 再往后：托管数据库、对象存储、容器平台

### 3.2 地域选择

判断方式：

1. 想尽快上线且不被备案阻塞：优先 `中国香港`
2. 想长期面向中国内地正式运营：优先 `广州 / 上海`

### 3.3 默认规格

建议默认从以下规格起步：

1. `2 核 4G`
2. `100GB SSD`
3. `Ubuntu 24.04 LTS`
4. `SSH 密钥登录`

---

## 4. 标准部署流程

### 第一步：购买资源

至少准备：

1. 腾讯云 Lighthouse 实例
2. 域名
3. SSL 证书

### 第二步：配置网络入口

默认开放：

1. `22`
2. `80`
3. `443`

默认不开放：

1. 应用内部端口，例如 `3000`
2. 数据库端口，例如 `5432`

### 第三步：初始化服务器

标准动作：

1. 系统更新
2. 配置时区
3. 创建部署用户
4. 安装 Git、Node、Nginx、PostgreSQL、PM2

### 第四步：部署应用

标准动作：

1. 从 GitHub 或其他 Git 平台拉代码
2. 配环境变量
3. 安装依赖
4. 执行数据库迁移
5. 构建项目
6. 用 PM2 启动

推荐把 Git 仓库作为唯一代码源，不建议长期依赖本地压缩包、`scp` 或 `rsync` 直接上传代码。

### 第五步：配置 Nginx

标准动作：

1. 反向代理到本地 Node.js 端口
2. 域名映射
3. HTTP 重定向 HTTPS

### 第六步：上线验收

标准动作：

1. 页面可访问
2. 核心用户流程可走通
3. 数据可写入数据库
4. 服务重启可恢复

---

## 5. 通用命令骨架

### 5.0 GitHub 拉取式部署骨架

服务器首次拉取：

```bash
cd /home/deploy
git clone git@github.com:OWNER/REPO.git app-name
cd app-name
```

后续常规发布：

```bash
cd /home/deploy/app-name
git fetch origin main
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm prisma:deploy
pnpm build
pm2 restart app-name --update-env
pm2 save
```

如果仓库是私有仓库，建议给服务器配置只读 deploy key。

原则：

1. 本地先 commit 和 push。
2. 服务器只 pull 已进入远端仓库的代码。
3. `.env` 留在服务器，不提交到 Git。
4. 不要把个人 GitHub 私钥放到服务器上。

### 5.1 安装 Node.js 与 PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable
sudo corepack prepare pnpm@latest --activate
sudo npm install -g pm2
```

### 5.2 安装基础环境

```bash
sudo apt update
sudo apt install -y git curl unzip build-essential nginx postgresql postgresql-contrib
```

### 5.3 启动 Node.js 服务

```bash
pm2 start "HOSTNAME=127.0.0.1 PORT=3000 pnpm start" --name app-name
pm2 save
pm2 startup systemd -u deploy --hp /home/deploy
```

### 5.4 Nginx 站点模板

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/nginx/ssl/your-domain_bundle.crt;
    ssl_certificate_key /etc/nginx/ssl/your-domain.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 6. 标准环境变量检查项

每个新项目上线前，都建议至少确认以下内容：

1. 数据库连接串是否使用线上真实端口
2. 第三方 API Key 是否已配置
3. 生产环境域名是否已更新
4. 是否仍残留本地开发环境变量
5. 是否有必须启用的加密、鉴权或回调地址配置

---

## 7. 标准验收清单

每个项目上线后，至少确认以下内容：

1. 域名访问正常
2. HTTPS 正常
3. 核心主流程可完整走通
4. 数据写入正常
5. 日志中无明显报错
6. PM2 重启后服务恢复
7. 服务器重启后服务恢复
8. 至少做过一次数据库备份验证

---

## 8. 常见升级路线

首发之后，常见演进顺序如下：

1. 单机应用 + 单机数据库
2. 数据库迁到托管服务
3. 静态资源迁到对象存储
4. 加监控、告警、备份自动化
5. 再评估容器化、多实例、负载均衡

原则是：

1. 先验证业务
2. 再提升稳定性
3. 最后提升架构复杂度

---

## 9. 使用建议

后续新项目若采用本模板，建议按以下方式落地：

1. 先复制本文档作为初始部署骨架。
2. 再补一份“项目专用部署指南”，记录当前项目的真实变量、命令和特殊限制。
3. 若执行过程中踩到新坑，再回写到经验清单，而不是只写进临时聊天记录。
