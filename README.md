# JVAV 课程表管理系统

一个基于 Vue.js 的现代化课程表管理系统，提供完整的课程安排、教师管理、教室管理等功能。

## 🚀 功能特性

- **课程管理**：创建、编辑、删除课程信息
- **教师管理**：管理教师信息和课程分配
- **教室管理**：教室资源分配和使用情况
- **课程安排**：可视化课程表，支持拖拽排课
- **批量操作**：支持批量导入/导出课程安排
- **课程提醒**：课程时间提醒功能
- **用户认证**：安全的登录注册系统
- **响应式设计**：适配各种设备尺寸

## 🛠️ 技术栈

- **前端框架**：Vue.js 2.6.11
- **UI 组件库**：Element UI 2.15.13
- **日历组件**：FullCalendar 5.3.0
- **状态管理**：Vuex 3.4.0
- **路由管理**：Vue Router 3.4.3
- **HTTP 客户端**：Axios 0.19.2
- **图表库**：ECharts 4.8.0
- **时间处理**：Moment.js 2.27.0
- **构建工具**：Vue CLI 4.4.0

## 📁 项目结构

```
timetable-web/
├── public/                 # 静态资源
│   └── index.html         # HTML 模板
├── src/
│   ├── api/               # API 接口
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── mixins/            # 混入
│   ├── mock/              # 模拟数据
│   ├── plugins/           # 插件配置
│   ├── router/            # 路由配置
│   ├── store/             # Vuex 状态管理
│   ├── util/              # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── babel.config.js        # Babel 配置
├── vue.config.js          # Vue CLI 配置
└── package.json           # 依赖配置
```

## 📦 安装依赖

使用 yarn（推荐）：

```bash
yarn install
```

或使用 npm：

```bash
npm install
```

## 🚀 开发

### 启动开发服务器

```bash
yarn serve
```

开发服务器将在 `http://localhost:12011` 启动

### 构建生产版本

```bash
yarn build
```

### 代码检查和修复

```bash
yarn lint
```

## 🔧 配置

### 环境变量

项目支持两种环境配置：

- **开发环境** (`.env.development`)：

  ```
  NODE_ENV=development
  VUE_APP_DEV_SERVER_HOST=0.0.0.0
  VUE_APP_DEV_SERVER_PORT=12011
  VUE_APP_BASE_URL=http://your-backend-server:port
  ```

- **生产环境** (`.env.production`)：
  ```
  NODE_ENV=production
  VUE_APP_BASE_URL=http://your-backend-server:port
  ```

> **注意**：请将 `your-backend-server:port` 替换为实际的后端服务器地址和端口号。

### 代理配置

开发环境下，API 请求会被代理到后端服务器：

```javascript
// vue.config.js
proxy: {
  '/api': {
    target: 'http://your-backend-server:port',
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  }
}
```

> **提示**：确保 `target` 地址与环境变量中的 `VUE_APP_BASE_URL` 保持一致。

## 📱 主要页面

- **登录/注册**：用户身份验证
- **课程管理**：课程的增删改查
- **教师管理**：教师信息管理
- **教室管理**：教室资源管理
- **课程安排**：可视化课程表编辑
- **基础数据管理**：系统基础数据配置
- **系统设置**：个人设置和系统配置

## 🎨 UI 设计

项目采用 Element UI 组件库，提供：

- 统一的设计语言
- 丰富的组件库
- 响应式布局
- 主题定制

## 📊 数据可视化

使用 ECharts 提供数据可视化功能：

- 课程统计图表
- 教师工作量分析
- 教室使用率统计

## 🔒 权限管理

- 基于角色的访问控制
- 路由守卫
- API 接口权限验证

## 📝 开发规范

- 遵循 Vue.js 官方风格指南
- 使用 ESLint 进行代码检查
- 组件命名使用 PascalCase
- 文件名使用 kebab-case

## 🐛 问题排查

### 常见问题

1. **端口被占用**：修改 `vue.config.js` 中的端口号
2. **API 请求失败**：检查代理配置和后端服务状态
3. **依赖安装失败**：清除 node_modules 并重新安装

### 调试技巧

- 使用 Vue DevTools 进行组件调试
- 检查浏览器开发者工具的 Network 面板
- 查看控制台错误信息

## 📄 更多信息

- [Vue.js 官方文档](https://vuejs.org/)
- [Element UI 官方文档](https://element.eleme.cn/)
- [Vue CLI 配置参考](https://cli.vuejs.org/config/)

## 👥 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📜 许可证

本项目仅用于教育和学习目的。
