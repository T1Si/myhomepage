# 部署指南：Vercel + 国内 CDN

本指南详细说明如何将个人作品集网站部署到 Vercel，并配置国内 CDN 加速。

## 第一步：准备工作

### 1.1 创建 Git 仓库

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 关联远程仓库（GitHub/GitLab/Gitee）
git remote add origin <your-repo-url>

# 推送到远程
git push -u origin main
```

### 1.2 注册 Vercel 账号

1. 访问 https://vercel.com
2. 使用 GitHub/GitLab/Bitbucket 账号登录
3. 授权 Vercel 访问你的仓库

## 第二步：部署到 Vercel

### 方式 A：通过 Web 界面部署（推荐新手）

1. 登录 Vercel Dashboard
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 找到你的项目仓库，点击 "Import"
5. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: `./` (保持默认)
   - **Build Command**: 留空或填 `echo "Static site"`
   - **Output Directory**: `src`
6. 点击 "Deploy"
7. 等待部署完成（通常 30 秒内）

### 方式 B：通过 CLI 部署（推荐开发者）

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 首次部署（会引导配置）
vercel

# 按提示操作：
# - Set up and deploy? Yes
# - Which scope? 选择你的账号
# - Link to existing project? No
# - What's your project's name? 输入项目名
# - In which directory is your code located? ./
# - Want to override the settings? No

# 4. 生产环境部署
vercel --prod
```

### 部署成功

部署完成后，你会获得：
- 预览地址：`https://your-project.vercel.app`
- 每次 Git push 都会自动重新部署
- 每个 Pull Request 都有独立的预览环境

## 第三步：配置自定义域名

### 3.1 在 Vercel 添加域名

1. 进入项目 Dashboard
2. 点击 "Settings" → "Domains"
3. 输入你的域名（如 `www.example.com`）
4. 点击 "Add"
5. Vercel 会提供 DNS 配置信息

### 3.2 暂时配置 DNS（指向 Vercel）

在你的域名服务商（阿里云/腾讯云/Cloudflare）添加 DNS 记录：

```
类型: CNAME
主机记录: www
记录值: cname.vercel-dns.com
TTL: 600
```

等待 DNS 生效（5-30 分钟），验证域名是否可以访问。

## 第四步：配置国内 CDN 加速

选择以下方案之一：

---

## 方案 A：阿里云 CDN（推荐国内用户）

### 前置条件
- 域名已备案
- 已注册阿里云账号

### 4A.1 开通阿里云 CDN

1. 登录 [阿里云 CDN 控制台](https://cdn.console.aliyun.com)
2. 开通 CDN 服务（按量付费，约 0.24 元/GB）

### 4A.2 添加加速域名

1. 点击 "域名管理" → "添加域名"
2. 配置信息：
   - **加速域名**: `www.example.com`
   - **业务类型**: 图片小文件
   - **源站信息**: 
     - 类型：源站域名
     - 域名：`your-project.vercel.app`（Vercel 提供的域名）
     - 端口：443
     - 协议：HTTPS
   - **加速区域**: 仅中国内地 或 全球
3. 点击 "下一步"

### 4A.3 配置 CDN 设置

#### 回源配置
1. 进入域名详情 → "回源配置"
2. 开启 "回源 HOST"
   - 回源 HOST 类型：自定义域名
   - 域名：`your-project.vercel.app`

#### 缓存配置
1. 进入 "缓存配置" → "缓存过期时间"
2. 添加规则：
   ```
   目录/文件: *.html
   过期时间: 1 分钟
   权重: 90
   
   目录/文件: *.css
   过期时间: 30 天
   权重: 80
   
   目录/文件: *.js
   过期时间: 30 天
   权重: 80
   
   目录/文件: *.md
   过期时间: 5 分钟
   权重: 70
   
   目录/文件: /
   过期时间: 1 天
   权重: 10
   ```

#### HTTPS 配置
1. 进入 "HTTPS 配置"
2. 开启 "HTTPS 安全加速"
3. 上传 SSL 证书（或使用阿里云免费证书）
4. 开启 "强制跳转 HTTPS"

### 4A.4 修改 DNS 解析

回到域名 DNS 管理，修改之前的 CNAME 记录：

```
类型: CNAME
主机记录: www
记录值: <阿里云提供的 CNAME 地址>.w.kunlunsl.com
TTL: 600
```

### 4A.5 验证配置

等待 5-10 分钟后：
```bash
# 检查 DNS 解析
nslookup www.example.com

# 测试访问速度
curl -I https://www.example.com
```

---

## 方案 B：腾讯云 CDN

### 前置条件
- 域名已备案
- 已注册腾讯云账号

### 4B.1 开通腾讯云 CDN

1. 登录 [腾讯云 CDN 控制台](https://console.cloud.tencent.com/cdn)
2. 开通 CDN 服务

### 4B.2 添加加速域名

1. 点击 "域名管理" → "添加域名"
2. 配置：
   - **加速域名**: `www.example.com`
   - **所属项目**: 默认项目
   - **加速区域**: 中国境内
   - **业务类型**: CDN 网页小文件
   - **源站配置**:
     - 源站类型：自有源
     - 回源协议：HTTPS
     - 源站地址：`your-project.vercel.app`
     - 回源 Host：`your-project.vercel.app`

### 4B.3 配置缓存规则

1. 进入域名配置 → "缓存配置"
2. 添加缓存规则：
   ```
   文件类型: .html
   缓存时间: 1 分钟
   
   文件类型: .css .js
   缓存时间: 30 天
   
   文件类型: .md
   缓存时间: 5 分钟
   
   所有文件: 1 天
   ```

### 4B.4 配置 HTTPS

1. 进入 "HTTPS 配置"
2. 配置证书（上传或申请免费证书）
3. 开启 "强制 HTTPS"

### 4B.5 修改 DNS

```
类型: CNAME
主机记录: www
记录值: <腾讯云提供的 CNAME>.cdn.dnsv1.com
TTL: 600
```

---

## 方案 C：Cloudflare（免费，国际化）

### 优点
- 完全免费
- 配置简单
- 全球 CDN

### 缺点
- 国内速度不如阿里云/腾讯云
- 需要将 DNS 托管到 Cloudflare

### 4C.1 添加网站到 Cloudflare

1. 登录 [Cloudflare](https://dash.cloudflare.com)
2. 点击 "添加站点"
3. 输入域名 `example.com`
4. 选择 Free 计划
5. Cloudflare 会扫描现有 DNS 记录

### 4C.2 配置 DNS

1. 添加/修改 DNS 记录：
   ```
   类型: CNAME
   名称: www
   目标: your-project.vercel.app
   代理状态: 已代理（橙色云朵）
   ```

2. 在域名注册商修改 NS 记录为 Cloudflare 提供的 NS 服务器

### 4C.3 优化设置

1. 进入 "速度" → "优化"
   - 开启 Auto Minify (HTML, CSS, JS)
   - 开启 Brotli 压缩

2. 进入 "缓存" → "配置"
   - 浏览器缓存 TTL: 4 小时
   - 开启 "始终在线"

3. 进入 "SSL/TLS"
   - 加密模式: 完全（严格）
   - 开启 "始终使用 HTTPS"

---

## 第五步：验证部署

### 5.1 检查网站访问

```bash
# 测试主域名
curl -I https://www.example.com

# 检查响应头
curl -I https://www.example.com | grep -i "cache\|cdn\|server"
```

### 5.2 测试访问速度

使用在线工具测试：
- [17CE](https://www.17ce.com) - 国内多节点测速
- [站长工具](https://tool.chinaz.com/speedtest) - 网站速度测试
- [GTmetrix](https://gtmetrix.com) - 性能分析

### 5.3 验证 CDN 是否生效

查看响应头中是否包含 CDN 标识：
- 阿里云：`X-Cache`, `Ali-Swift-Global-Savetime`
- 腾讯云：`X-Cache-Lookup`, `Server: Tencent-Cdn`
- Cloudflare：`CF-Cache-Status`, `Server: cloudflare`

## 第六步：持续部署

### 自动部署流程

1. 修改代码并提交
```bash
git add .
git commit -m "Update content"
git push
```

2. Vercel 自动检测到推送
3. 自动构建和部署（30秒内）
4. CDN 自动刷新缓存（或手动刷新）

### 手动刷新 CDN 缓存

#### 阿里云
```bash
# 进入 CDN 控制台 → 刷新预热 → 刷新缓存
# 输入 URL 或目录
```

#### 腾讯云
```bash
# 进入 CDN 控制台 → 缓存刷新 → 提交刷新
```

#### Cloudflare
```bash
# 进入 Cloudflare → 缓存 → 清除缓存
# 选择 "清除所有内容"
```

## 成本估算

### Vercel
- Hobby 计划：免费
- 100GB 带宽/月（个人网站足够）

### CDN 成本（按月访问 10GB 流量计算）

#### 阿里云 CDN
- 流量费：10GB × 0.24元/GB = 2.4元/月
- HTTPS 请求：免费（前 1000 万次）
- 总计：约 3-5 元/月

#### 腾讯云 CDN
- 流量费：10GB × 0.21元/GB = 2.1元/月
- HTTPS 请求：免费（前 1000 万次）
- 总计：约 3-5 元/月

#### Cloudflare
- 完全免费
- 无流量限制

## 故障排查

### 问题 1：域名无法访问

**检查项**：
1. DNS 是否生效（`nslookup www.example.com`）
2. Vercel 域名是否添加成功
3. CDN 配置是否正确

### 问题 2：样式/脚本加载失败

**解决方案**：
1. 检查 `vercel.json` 中的路径配置
2. 确认 `outputDirectory` 设置为 `src`
3. 检查浏览器控制台错误信息

### 问题 3：Markdown 文档加载失败

**解决方案**：
1. 检查 CORS 配置（已在 `vercel.json` 中配置）
2. 确认文档路径正确
3. 检查 CDN 缓存设置

### 问题 4：CDN 缓存未更新

**解决方案**：
1. 手动刷新 CDN 缓存
2. 检查缓存规则配置
3. 使用 `?v=timestamp` 强制刷新

## 监控和优化

### 性能监控

1. **Vercel Analytics**
   - 进入项目 → Analytics
   - 查看访问量、性能指标

2. **CDN 监控**
   - 阿里云/腾讯云控制台查看流量、带宽
   - 设置流量告警

### 优化建议

1. **图片优化**
   - 使用 WebP 格式
   - 压缩图片大小
   - 使用 CDN 图片处理

2. **代码优化**
   - 压缩 CSS/JS
   - 移除未使用的代码
   - 使用字体子集

3. **缓存策略**
   - HTML: 短缓存（1分钟）
   - CSS/JS: 长缓存（30天）+ 版本号
   - 图片: 长缓存（1年）

## 总结

完成以上步骤后，你的网站将：
- ✅ 部署在 Vercel（全球 CDN）
- ✅ 使用国内 CDN 加速（国内访问快）
- ✅ 自动 HTTPS 证书
- ✅ 自动部署（Git push 即部署）
- ✅ 高可用性和性能

**推荐配置**：
- 个人项目：Vercel + Cloudflare（免费）
- 商业项目：Vercel + 阿里云/腾讯云 CDN（国内最快）

有问题随时查看本文档或联系技术支持。
