# ssbt's blog

个人博客，线上地址：<https://kwssbt.github.io/>

用 [Astro](https://astro.build/) 搭建的静态站点，文章是 Markdown 文件，推送到 `master` 后由 GitHub Actions 构建并发布到 GitHub Pages。

## 技术栈

| 用途 | 方案 |
| --- | --- |
| 框架 | Astro 7（需要 Node ≥ 22.12） |
| 文章 | `src/content/posts/` 下的 Markdown，content collections + glob loader |
| 数学公式 | `remark-math` + `rehype-katex`，构建期渲染，字体自动本地化，访问时不需要联网 |
| 代码高亮 | Shiki，亮/暗两套主题随系统切换 |
| RSS / sitemap | `@astrojs/rss`、`@astrojs/sitemap` |
| 部署 | GitHub Actions → GitHub Pages（`master` 分支） |

## 常用命令

```bash
npm install        # 安装依赖
npm run dev        # 本地开发，默认 http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 预览构建产物
```

Astro 7 的 `npm run dev` 会把 dev server 放到后台常驻：`npx astro dev status` 看状态，`npx astro dev stop` 停掉。4321 被占用时会自动改用 4322 等端口，启动日志里会打印实际地址。

## 目录结构

```
astro.config.mjs        站点配置：site、sitemap、markdown 处理器与代码高亮主题
src/consts.ts           站点标题、描述、作者、日期格式化等全局常量
src/content.config.ts   文章集合的 schema（frontmatter 字段定义）
src/content/posts/      文章目录，一个 Markdown 文件就是一篇文章
src/layouts/            BaseLayout（页面骨架）、PostLayout（文章页）
src/pages/index.astro   首页文章列表
src/pages/posts/        文章列表页与 [...slug] 详情路由
src/pages/about.astro   关于页
src/pages/404.astro     404 页
src/pages/rss.xml.ts    RSS 输出
src/styles/global.css   全站样式（含深色模式变量）
public/                 favicon、robots.txt 等原样拷贝的静态文件
```

## 写一篇新文章

在 `src/content/posts/` 下新建 `标题.md`（文件名最好用英文短横线格式），frontmatter：

```yaml
---
title: 文章标题
date: 2026-09-14
description: 一句话摘要，会进 RSS 和页面 meta
tags: [算法, 笔记]      # 可选
draft: false           # 可选，true 时只在 npm run dev 里可见
---
```

访问地址由文件名决定：`src/content/posts/binary-inversion.md` → `/posts/binary-inversion/`，所以**改文件名等于改 URL**。

## 日常工作流

1. 换电脑或换环境时先 `git pull`，然后 `npm install`
2. `npm run dev` 起本地预览，浏览器打开 <http://localhost:4321>（改动会热更新，不用刷新）
3. 在 `src/content/posts/` 新建 Markdown 文件，写完保存即时看到效果
4. 发布前想看真实产物就 `npm run build && npm run preview`
5. 提交并发布：

```bash
git add -A
git commit -m "新增：二项式反演"
git push
```

推送后 GitHub Actions 自动构建部署，一两分钟后线上更新。构建进度和报错日志在仓库的 Actions 标签页。

### 草稿

frontmatter 里写 `draft: true`：本地 `npm run dev` 能看到，正式构建和线上不会出现。定稿时改成 `false` 或删掉这一行。

## 图片

两种放法，按需要选：

- **简单**：图片放进 `public/images/`（目录不存在就新建），正文写 `![说明](/images/foo.png)`。文件原样拷贝，路径固定，适合截图和动图。
- **会做优化**：图片放进 `src/assets/`，正文用相对路径 `![说明](../../assets/foo.png)`。构建时生成带哈希的文件、自动压缩，并补上 `loading="lazy"`、宽高（减少布局抖动）。

图片会一起进 git 仓库，建议先压缩再放进来，单张尽量控制在几百 KB 以内。

## 数学公式

行内用 `$...$`，独立成行用 `$$...$$`，其余交给 KaTeX：

```markdown
二项式反演：$g(k) = \sum_{i=k}^{n} (-1)^{i-k} \binom{i}{k} f(i)$
```

## 部署

```bash
git add -A
git commit -m "写点什么"
git push
```

推送到 `master` 会触发 `.github/workflows/deploy.yml`：`npm ci` → `npm run build` → 上传 `dist/` 并发布到 GitHub Pages。

如果部署失败，先确认仓库 Settings → Pages 里 Source 选的是 **GitHub Actions**。

## 维护

- **确认线上状态**：访问 <https://kwssbt.github.io/>，或看仓库 Actions 最近一次运行是否绿色
- **升级依赖**：`npm outdated` 看新版本 → `npm install astro@latest`（或对应包）→ 本地 `npm run build` 通过后再提交
- **回滚**：`git revert <commit>` 后 push，Actions 会重新部署到上一版可用状态；临时救急也可以在 GitHub 上把某次成功的部署重新发布
- **备份**：文章、图片、配置都在 git 里，本地 + GitHub 各一份，不用额外备份；`dist/`、`node_modules/` 是产物，不入库
- **换机器**：`git clone` → `npm install` → 正常写作，环境要求只有 Node ≥ 22.12

## 自定义

- 改站点标题、描述、页脚署名：`src/consts.ts`
- 改配色、字体、内容宽度：`src/styles/global.css` 顶部的 CSS 变量
- 加标签页、文章目录、评论等功能告诉我，我接着加
