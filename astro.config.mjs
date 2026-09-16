// @ts-check
// frontmatter 里的时间不带时区时，会被按“构建机本地时间”解释。
// 这里固定成北京时间，避免本地（+08:00）与 GitHub Actions（UTC）差 8 小时。
process.env.TZ ||= "Asia/Shanghai";

import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

export default defineConfig({
  site: "https://kwssbt.github.io",
  integrations: [sitemap()],
  markdown: {
    // 数学公式：remark-math 解析 $...$ / $$...$$，rehype-katex 在构建期渲染成 HTML
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
});
