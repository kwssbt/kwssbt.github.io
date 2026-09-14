# ssbt's blog

个人博客，线上地址：<https://kwssbt.github.io/>

- **Jekyll** 静态站点，主题为 [no-style-please](https://github.com/riggraz/no-style-please)，主题文件已内置到本仓库的 `_layouts/`、`_includes/`、`_sass/`，不依赖远程主题
- **jektex** 在构建期把 `$...$` 渲染成 KaTeX 结构，页面通过 CDN 引入 KaTeX 样式
- **GitHub Actions** 构建并发布到 GitHub Pages（仓库 `kwssbt/kwssbt.github.io`，分支 `master`）

## 目录结构

```
_config.yml        站点配置：标题、URL、插件、主题外观、排除文件等
index.md           首页，使用 home 布局
_data/menu.yml     首页导航结构，改导航只需要动这个文件
_posts/            文章，文件名必须是 YYYY-MM-DD-slug.md
_layouts/          页面模板：default / home / post / page / archive
_includes/         可复用片段：head、导航、文章列表等
_sass/             主题样式，编译到 assets/css/main.css
assets/            图片与脚本
notes.md/talks.md  分类归档页，按 category 聚合文章
404.md             404 页面
robots.txt         爬虫规则，内含 sitemap 地址
```

## 本地预览

需要 Ruby 3.4+ 与 Bundler：

```bash
bundle install
bundle exec jekyll serve --livereload
```

浏览器打开 <http://127.0.0.1:4000/>。`bundle install` 会生成 `Gemfile.lock`，请把它一起提交，这样本地与 CI 的依赖版本完全一致。

## 写一篇新文章

在 `_posts/` 下新建 `YYYY-MM-DD-标题.md`：月份和日期要补零，文件名里不要出现空格（空格会被转换成连字符，容易和预期不符）。正文用 Markdown 写，文件头的 front matter 如下：

```yaml
---
layout: post
title: 文章标题
date: 2026-03-26
category: notes      # 目前只有 notes / talks，新增分类要同步改 _data/menu.yml
description: 一句话摘要，用于搜索结果和分享卡片
---
```

- 访问地址由 `_config.yml` 里的 `permalink: /:slug.html` 决定，`slug` 取自文件名去掉日期后的部分，所以**改文件名等于改 URL**
- 分类归档页参考 `notes.md`，`which_category` 要和文章里的 `category` 一致
- 首页导航由 `_data/menu.yml` 驱动：`post_list` 会内联渲染文章列表，`url` 则把条目标题变成链接

## 数学公式

行内公式用 `$...$`，独立成行的用 `$$...$$`。jektex 在构建时完成渲染，因此公式在浏览器端不需要额外的 JS；但 KaTeX 的样式表来自 CDN，离线查看时公式排版会退化。

## 部署

推送到 `master` 即触发 `.github/workflows/jekyll.yml`：构建 `_site/` 并上传到 GitHub Pages。

建议在仓库 Settings → Pages 里确认 Source 为 **GitHub Actions**，避免旧的分支部署方式同时生效、互相覆盖产物。

## 许可

文章内容版权归作者所有；主题代码来自 no-style-please，遵循 MIT 许可，详见 `LICENSE.txt`。
