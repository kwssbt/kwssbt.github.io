#!/usr/bin/env node
/**
 * 构建前检查文章里的图片引用，问题只提示、不阻断构建。
 * 由 package.json 的 prebuild 自动调用。
 */
import { access, readdir, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const POSTS_DIR = "src/content/posts";
const PUBLIC_DIR = "public";

const exists = async (target) => {
  try {
    await access(target, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const files = (await readdir(POSTS_DIR)).filter((file) => file.endsWith(".md"));
const problems = [];

for (const file of files) {
  const postPath = path.join(POSTS_DIR, file);
  const text = await readFile(postPath, "utf8");

  const refs = [
    ...[...text.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]),
    ...[...text.matchAll(/<img[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]),
    ...[...text.matchAll(/<img[^>]*\bsrc='([^']+)'/g)].map((m) => m[1]),
  ];

  for (const raw of refs) {
    const src = raw.trim();
    if (!src || /^(https?:)?\/\//.test(src) || src.startsWith("data:")) continue;

    if (src.startsWith("/src/")) {
      problems.push({
        file,
        src,
        reason: "src/ 目录不会被发布，改成相对路径，例如 ./图片.jpg",
      });
      continue;
    }

    if (src.startsWith("/")) {
      // 站点根路径 → 必须能在 public/ 里找到
      if (!(await exists(path.join(PUBLIC_DIR, src)))) {
        problems.push({
          file,
          src,
          reason: `public/ 里没有这个文件（应位于 public${src}）`,
        });
      }
      continue;
    }

    // 相对路径 → 相对文章所在目录解析
    if (!(await exists(path.resolve(path.dirname(postPath), src)))) {
      problems.push({
        file,
        src,
        reason: "相对路径找不到这个文件（注意大小写和扩展名）",
      });
    }
  }
}

if (problems.length > 0) {
  console.log("");
  console.log(`⚠ 有 ${problems.length} 处图片引用可能无法显示：`);
  for (const p of problems) {
    console.log(`   - ${p.file}: ${p.src}`);
    console.log(`     ${p.reason}`);
  }
  console.log("");
}
