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
npm run new -- <文件名> "标题"   # 按模板新建一篇文章
```

Astro 7 的 `npm run dev` 会把 dev server 放到后台常驻：`npx astro dev status` 看状态，`npx astro dev stop` 停掉。4321 被占用时会自动改用 4322 等端口，启动日志里会打印实际地址。

## 预览

按需要选一种：

| 方式 | 怎么做 | 说明 |
| --- | --- | --- |
| 编辑器内快速看 | 在 `.md` 里按 `Ctrl+K` 再按 `V` | 不用起服务器；公式需要装 Markdown Preview Enhanced 之类的扩展才渲染 |
| 和线上一致（推荐） | 终端 `npm run dev`，浏览器开 <http://localhost:4321> | 改动即时刷新；加 `-- --open` 会自动打开浏览器 |
| 看真实构建产物 | `npm run build && npm run preview` | 和线上一样不带草稿，`draft: true` 的文章看不到 |
| 直接看线上 | 提交推送后访问 <https://kwssbt.github.io/> | 部署要一两分钟 |

在 VS Code 里也可以不用敲命令：`Ctrl+Shift+P` → `Tasks: Run Task`，选 `.vscode/tasks.json` 里预置的四项（启动预览 / 构建预览 / 停止服务器 / 构建校验）。其中"启动预览"绑定了默认构建任务，直接按 `Ctrl+Shift+B` 就能跑。

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
public/                 favicon、robots.txt、images/（文章图片）等原样拷贝的静态文件
templates/post.md       新文章模板，npm run new 与 VS Code 片段都用它
scripts/                new-post.mjs（生成文章）、make-favicon.mjs（生成图标）
.vscode/                文章片段、预览任务、扩展推荐
docs/markdown.md        Markdown 语法速查（本站实测）
```

## 写一篇新文章

用模板生成，文件名和标题一起给：

```bash
npm run new -- binary-inversion "二项式反演"
```

它会把 [templates/post.md](templates/post.md) 里的 `{{title}}`、`{{date}}` 替换好，生成 `src/content/posts/binary-inversion.md`，日期取本地当天，默认 `draft: true`。已存在的文件不会被覆盖。想改默认内容就直接编辑 `templates/post.md`（加常用小节、改 tags 等等），也可以用 `npm run new -- 文件名` 只给文件名、标题后面自己填。

不想用命令就手动复制一份 `templates/post.md`，注意把两个占位符替换掉。生成后的 frontmatter：

```yaml
---
title: 文章标题
date: 2026-09-14 21:30    # 精确到分钟，按北京时间
description: 一句话摘要，会进 RSS 和页面 meta
tags: [算法, 笔记]      # 可选
draft: false           # 可选，true 时只在 npm run dev 里可见
---
```

### 在 VS Code 里手动新建文件

1. 在 `src/content/posts/` 上右键 → 新建文件，文件名用英文短横线格式，例如 `binary-inversion.md`
2. 光标停在第一行，输入 `post`，按 `Tab`（或从补全提示里选「新文章 frontmatter」）
3. 模板展开后按 `Tab` 依次填标题、摘要、tags，日期已经自动填成今天
4. `npm run dev` 跑着，浏览器开 <http://localhost:4321> 边写边看

片段定义在 `.vscode/post.code-snippets`，是仓库文件，换机器也会跟着走。它和 `templates/post.md` 的内容一致，改了一处记得同步另一处；改完片段如果没生效，重新加载一下 VS Code 窗口即可。

另外还有一个 `math` 片段：正文里输入 `math` 按 `Tab` 展开成 `$$...$$` 公式块。

访问地址由文件名决定：`src/content/posts/binary-inversion.md` → `/posts/binary-inversion/`，所以**改文件名等于改 URL**。

各种语法的实测结果（表格对齐、公式、折叠块、脚注、`$` 转义等）整理在 [docs/markdown.md](docs/markdown.md)。

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
- 改站点图标：替换 `src/assets/favicon-source.jpg`（自动对准人物脸部的裁剪，范围在脚本里）后跑 `npm run favicon`，会重新生成 `public/` 下的三张 PNG
- 加标签页、文章目录、评论等功能告诉我，我接着加
