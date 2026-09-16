#!/usr/bin/env node
/**
 * 按 templates/post.md 生成一篇新文章。
 *
 *   npm run new -- <文件名> ["文章标题"]
 *   npm run new -- binary-inversion "二项式反演"
 *
 * 模板里可用占位符：{{title}}、{{date}}。
 * 生成的文件默认 draft: true，写完把 draft 改成 false 再提交推送。
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const POSTS_DIR = "src/content/posts";
const TEMPLATE_PATH = "templates/post.md";

const [rawSlug, ...titleParts] = process.argv.slice(2);

if (!rawSlug || rawSlug.startsWith("-")) {
  console.error('用法: npm run new -- <文件名> ["文章标题"]');
  console.error('例如: npm run new -- binary-inversion "二项式反演"');
  process.exit(1);
}

const slug = rawSlug.trim().replace(/\s+/g, "-");
const title = titleParts.join(" ").trim() || slug;

const templatePath = path.resolve(TEMPLATE_PATH);
const targetPath = path.resolve(POSTS_DIR, `${slug}.md`);
const displayPath = path.relative(process.cwd(), targetPath);

// 不覆盖已有文件
try {
  await access(targetPath, constants.F_OK);
  console.error(`文件已存在，没有改动：${displayPath}`);
  process.exit(1);
} catch {
  // 不存在，继续
}

let template;
try {
  template = await readFile(templatePath, "utf8");
} catch {
  console.error(`找不到模板文件：${TEMPLATE_PATH}`);
  process.exit(1);
}

// 用本地时间（北京时间），精确到分钟，便于同一天多篇按时间排序
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const date =
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
  ` ${pad(now.getHours())}:${pad(now.getMinutes())}`;

const content = template
  .replaceAll("{{title}}", title)
  .replaceAll("{{date}}", date);

await mkdir(path.dirname(targetPath), { recursive: true });
await writeFile(targetPath, content, "utf8");

console.log(`已创建 ${displayPath}`);
console.log(`预览地址 http://localhost:4321/posts/${slug}/（npm run dev 之后）`);
console.log("写完后把 frontmatter 里的 draft 改成 false，再 commit + push。");
