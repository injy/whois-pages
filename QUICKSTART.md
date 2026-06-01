# 快速开始 - 部署到阿里云 ESA / 腾讯云 EO

## 步骤 1: 初始化 Git 仓库并推送到 GitHub

```bash
# 进入项目目录
cd c:\kc\web\whois\whois-page

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "Initial commit: WHOIS Domain Lookup application"

# 在 GitHub 上创建新仓库后，添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/whois-domain-lookup.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 步骤 2: 在阿里云 ESA 或腾讯云 EO 配置自动部署

### 阿里云 ESA

1. 登录 [阿里云 ESA 控制台](https://esa.console.aliyun.com/)
2. 点击"创建应用"
3. 选择"从 Git 仓库导入"
4. 选择 GitHub 并授权
5. 选择您的 `whois-domain-lookup` 仓库
6. 配置构建设置：
   - **构建命令**: `npm run build`
   - **输出目录**: `frontend/dist`
   - **启动命令**: `node backend/server.js`
   - **Node.js 版本**: 18 或更高
7. 添加环境变量：
   - `NODE_ENV = production`
8. 点击"部署"

### 腾讯云 EO (EdgeOne)

1. 登录 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 进入"Pages"或"应用托管"
3. 点击"新建应用"
4. 选择"从 GitHub 导入"
5. 授权并选择 `whois-domain-lookup` 仓库
6. 配置构建设置：
   - **框架**: Node.js
   - **构建命令**: `npm run build`
   - **输出目录**: `frontend/dist`
   - **启动命令**: `node backend/server.js`
7. 添加环境变量：
   - `NODE_ENV = production`
8. 点击"部署"

## 步骤 3: 验证部署

部署完成后，平台会提供一个域名（如 `xxx.esa.aliyuncs.com` 或 `xxx.edgeone.app`）。

访问该域名测试：
- 首页应该显示 WHOIS 查询界面
- 输入域名（如 `google.com`）并搜索
- 应该能看到 WHOIS 和 RDAP 查询结果

## 自定义域名（可选）

在阿里云 ESA 或腾讯云 EO 控制台中，您可以绑定自己的域名：

1. 进入应用设置
2. 找到"自定义域名"选项
3. 添加您的域名
4. 按照提示配置 DNS CNAME 记录

## 后续更新

每次推送代码到 GitHub 的 main 分支时，平台会自动重新构建和部署：

```bash
# 修改代码后
git add .
git commit -m "Update feature"
git push
```

几分钟后，您的更改就会自动部署到线上。

## 故障排查

### 构建失败

检查 GitHub Actions 或平台构建日志，常见原因：
- 依赖安装失败：确保 `package.json` 正确
- 构建命令错误：确认 `npm run build` 能成功执行

### 启动失败

检查运行时日志：
- 端口冲突：平台会自动设置 `PORT` 环境变量
- 依赖缺失：确保运行了 `npm install`

### API 查询失败

- 检查平台是否允许出站 TCP 连接（WHOIS 需要）
- 查看服务器日志中的错误信息
