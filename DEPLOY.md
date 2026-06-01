# 部署指南

## 项目结构

这是一个单体应用，后端（Node.js + Express）同时提供 API 服务和前端静态文件。

```
whois-page/
├── backend/           # Node.js 后端（包含服务器和 API）
│   ├── src/
│   │   ├── routes/    # API 路由
│   │   ├── services/  # 业务逻辑
│   │   ├── parsers/   # WHOIS 解析器
│   │   └── data/      # 服务器映射数据
│   ├── server.js      # 服务器入口
│   └── package.json
├── frontend/          # Vue 3 前端
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── stores/
│   │   └── ...
│   ├── dist/          # 构建输出（部署时生成）
│   └── package.json
└── package.json       # 根目录配置
```

## 本地开发

### 1. 安装依赖

```bash
cd whois-page
npm run install:all
```

### 2. 构建前端

```bash
npm run build
```

这会在 `frontend/dist/` 目录生成静态文件。

### 3. 启动服务器

```bash
npm start
```

服务器将在 http://localhost:3000 启动，同时提供前端页面和 API 服务。

## 部署到阿里云 ESA

### 方式一：使用控制台部署

1. 登录阿里云 ESA 控制台
2. 创建新应用
3. 选择 Node.js 运行时
4. 上传项目代码或连接 Git 仓库
5. 设置启动命令：`cd backend && node server.js`
6. 设置环境变量：
   - `NODE_ENV=production`
   - `PORT=3000`（或使用平台分配的端口）

### 方式二：使用 CLI 部署

```bash
# 安装阿里云 CLI
npm install -g @alicloud/cli

# 登录
aliyun login

# 部署
aliyun esa deploy
```

## 部署到腾讯云 EO (EdgeOne)

### 步骤

1. 登录腾讯云 EdgeOne 控制台
2. 创建新应用
3. 选择 Node.js 运行时
4. 连接 Git 仓库或上传代码
5. 配置构建命令：`npm run build`
6. 配置启动命令：`cd backend && node server.js`
7. 设置环境变量：
   - `NODE_ENV=production`
   - `PORT`（使用平台变量）

## 部署到其他平台

### Render

1. 连接 GitHub 仓库
2. 服务类型：Web Service
3. 构建命令：`npm run build`
4. 启动命令：`cd backend && node server.js`
5. 环境变量：`NODE_ENV=production`

### Railway

1. 连接 GitHub 仓库
2. 自动检测 Node.js 项目
3. 设置启动命令：`cd backend && node server.js`

### Vercel

已提供 `vercel.json` 配置文件，直接连接 GitHub 仓库即可自动部署。

### Docker

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm run install:all

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "backend/server.js"]
```

构建和运行：

```bash
docker build -t whois-lookup .
docker run -p 3000:3000 whois-lookup
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务器端口 | `3000` |
| `NODE_ENV` | 运行环境 | `production` |

## 注意事项

1. **端口配置**：云平台通常会通过 `PORT` 环境变量分配端口，确保服务器使用该变量
2. **构建输出**：确保 `frontend/dist/` 目录在部署前已生成
3. **依赖安装**：确保前后端依赖都已安装
4. **WHOIS 协议**：WHOIS 查询使用 TCP 43 端口，确保云平台允许出站 TCP 连接
5. **超时设置**：WHOIS/RDAP 查询超时为 10 秒

## 故障排查

### 前端页面空白

检查 `frontend/dist/` 目录是否存在且包含构建后的文件。

### API 请求失败

检查服务器日志，确认 API 路由是否正确注册。

### WHOIS 查询超时

某些云平台可能限制出站 TCP 连接，考虑使用第三方 WHOIS API 替代。
