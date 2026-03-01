# 个人作品集网站

一个现代化的个人作品集网站，展示项目和技能。

## 技术栈

- HTML5
- CSS3 (响应式设计)
- JavaScript (原生)
- Markdown 文档系统

## 项目结构

```
├── src/                    # 网站源代码
│   ├── index.html         # 主页
│   ├── project1.html      # 项目详情页
│   ├── project1-docs.html # 文档中心
│   ├── style.css          # 样式文件
│   ├── common/            # 公共模块
│   │   └── docLoader.js   # 文档加载器
│   └── assets/            # 资源文件
│       └── docs/          # Markdown 文档
├── vercel.json            # Vercel 配置
└── README.md              # 项目说明
```

## 本地开发

1. 克隆项目
```bash
git clone <your-repo-url>
cd <project-name>
```

2. 使用本地服务器运行（推荐）
```bash
# 使用 Python
python -m http.server 8000 --directory src

# 或使用 Node.js
npx serve src
```

3. 访问 http://localhost:8000

## 部署到 Vercel

### 方式一：通过 Git 仓库部署（推荐）

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 访问 [Vercel](https://vercel.com)
3. 点击 "Import Project"
4. 选择你的仓库
5. Vercel 会自动识别配置并部署

### 方式二：使用 Vercel CLI

1. 安装 Vercel CLI
```bash
npm install -g vercel
```

2. 登录 Vercel
```bash
vercel login
```

3. 部署项目
```bash
vercel --prod
```

## 配置国内 CDN 加速

部署到 Vercel 后，为了提升国内访问速度，建议配置 CDN：

### 使用阿里云 CDN

1. 在 Vercel 绑定自定义域名（如 `example.com`）
2. 登录阿里云 CDN 控制台
3. 添加加速域名（如 `www.example.com`）
4. 源站设置为 Vercel 提供的域名（如 `your-project.vercel.app`）
5. 配置 CNAME 记录指向阿里云 CDN

### 使用腾讯云 CDN

1. 在 Vercel 绑定自定义域名
2. 登录腾讯云 CDN 控制台
3. 添加域名加速
4. 源站类型选择"自有源"
5. 回源地址填写 Vercel 域名
6. 配置 DNS CNAME 记录

### 使用 Cloudflare（免费方案）

1. 将域名 DNS 托管到 Cloudflare
2. 在 Vercel 添加自定义域名
3. Cloudflare 会自动提供 CDN 加速
4. 开启 Cloudflare 的"中国网络"（需要企业版）

## 更新文档

文档文件位于 `src/assets/docs/` 目录，支持 Markdown 格式：

- `about.md` - 关于页面
- `guide.md` - 使用指南
- `privacy.md` - 隐私政策
- `terms.md` - 用户协议
- `update-log.md` - 更新日志

修改后推送到 Git，Vercel 会自动重新部署。

## 自定义配置

### 修改个人信息

编辑 `src/index.html`：
- 修改导航栏 logo
- 更新首页标题和描述
- 修改联系方式链接

### 添加新项目

1. 在 `src/index.html` 的项目网格中添加新卡片
2. 创建对应的项目详情页（参考 `project1.html`）
3. 可选：创建项目文档中心（参考 `project1-docs.html`）

### 修改样式

编辑 `src/style.css` 中的 CSS 变量：
```css
:root {
  --primary: #6366f1;        /* 主色调 */
  --primary-dark: #4f46e5;   /* 深色主色调 */
  --text-primary: #1f2937;   /* 主文本颜色 */
  --text-secondary: #6b7280; /* 次要文本颜色 */
}
```

## 性能优化

- 静态资源使用 CDN 加速
- HTML 文件设置短缓存（即时更新）
- CSS/JS/图片设置长缓存（1年）
- Markdown 文档设置中等缓存（5分钟）

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- 移动端浏览器

## License

MIT License

## 联系方式

- Email: your@email.com
- GitHub: https://github.com/yourusername
