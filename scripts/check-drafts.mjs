#!/usr/bin/env node
/**
 * 构建前列出不会发布的草稿（frontmatter 里 draft: true）。
 * 由 package.json 的 prebuild 自动调用，只提示、不阻断构建。
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DIR = "src/content/posts";

const files = (await readdir(DIR)).filter((file) => file.endsWith(".md"));
const drafts = [];

for (const file of files) {
  const text = await readFile(path.join(DIR, file), "utf8");
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) continue;

  if (/^\s*draft:\s*true\s*$/m.test(frontmatter[1])) {
    const title = frontmatter[1].match(/^\s*title:\s*(.+)$/m);
    drafts.push({
      file,
      title: title ? title[1].trim().replace(/^["']|["']$/g, "") : "",
    });
  }
}

if (drafts.length > 0) {
  console.log("");
  console.log(`⚠ 有 ${drafts.length} 篇草稿（draft: true）不会发布到线上：`);
  for (const draft of drafts) {
    console.log(`   - ${draft.file}${draft.title ? `（${draft.title}）` : ""}`);
  }
  console.log("  想发布就把 frontmatter 里的 draft 改成 false，再 commit + push。");
  console.log("");
}
