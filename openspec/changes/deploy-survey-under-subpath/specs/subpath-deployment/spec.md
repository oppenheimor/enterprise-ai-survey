## ADDED Requirements

### Requirement: Survey application shall run under a fixed subpath

系统 SHALL 支持将当前 H5 应用部署在 `/enterprise-ai-survey` 子路径下，并保证用户可通过该前缀访问首页、看板页和分析 API，而不要求根路径 `/` 承担当前应用首页职责。

#### Scenario: Home page resolves under subpath
- **WHEN** 用户访问 `/enterprise-ai-survey`
- **THEN** 系统必须返回当前问卷首页内容

#### Scenario: Dashboard resolves under subpath
- **WHEN** 用户访问 `/enterprise-ai-survey/dashboard`
- **THEN** 系统必须返回运营看板页面内容

#### Scenario: Analysis API resolves under subpath
- **WHEN** 客户端请求 `/enterprise-ai-survey/api/survey/analysis`
- **THEN** 系统必须将请求正确路由到当前分析接口

### Requirement: Application-generated paths shall respect the subpath

系统生成的页面跳转、客户端 API 请求、缓存失效路径和主要静态资源引用 SHALL 与 `/enterprise-ai-survey` 子路径保持一致，不得偷偷退回站点根路径。

#### Scenario: Navigation keeps subpath prefix
- **WHEN** 用户在首页、结果页或看板页中触发内部跳转
- **THEN** 生成的 URL 必须保持 `/enterprise-ai-survey` 前缀

#### Scenario: Client requests keep subpath prefix
- **WHEN** 客户端代码发起分析 API 请求
- **THEN** 请求地址必须指向 `/enterprise-ai-survey/api/survey/analysis`

#### Scenario: Revalidation targets subpath pages
- **WHEN** 服务端 mutation 触发看板页缓存失效
- **THEN** 系统必须对 `/enterprise-ai-survey/dashboard` 对应路径执行失效刷新

#### Scenario: Static assets remain accessible
- **WHEN** 页面加载字体、Next.js 静态资源或角色图片
- **THEN** 这些资源必须能在子路径部署形态下正常加载
