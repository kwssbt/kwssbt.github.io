#!/usr/bin/env node
/**
 * 压缩图片目录里的原图：
 *
 *   npm run optimize-images
 *
 * 处理 public/images/ 与 src/content/posts/ 两个目录里的 JPG。
 * 规则：
 *  - 长边超过 1600px 的照片缩到 1600px（文章正文最多显示 600 多像素宽，够用）
 *  - 文件名带 Screenshot 的（手机截图，文字多）保留原尺寸，只重新编码
 *  - 统一用 mozjpeg 重新编码，质量 82
 *  - 只有体积变小才覆盖，覆盖前原图已在 git 历史里，可用
 *    `git show <commit>:路径 > 文件` 找回
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIRS = ["public/images", "src/content/posts"];
const MAX_EDGE = 1600;
const QUALITY = 82;

const kb = (bytes) => `${Math.round(bytes / 1024)}KB`;
let totalBefore = 0;
let totalAfter = 0;
let processed = 0;

for (const dir of DIRS) {
  let entries = [];
  try {
    entries = (await readdir(dir)).filter((file) => /\.(jpe?g)$/i.test(file));
  } catch {
    continue;
  }

  for (const file of entries) {
    const target = path.join(dir, file);
    const before = (await stat(target)).size;
    const buffer = await readFile(target);
    const meta = await sharp(buffer).metadata();

    const isScreenshot = /screenshot/i.test(file);
    const pipeline = isScreenshot
      ? sharp(buffer)
      : sharp(buffer).resize({
          width: MAX_EDGE,
          height: MAX_EDGE,
          fit: "inside",
          withoutEnlargement: true,
        });

    const output = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
    const after = output.length;
    const outMeta = await sharp(output).metadata();

    totalBefore += before;
    totalAfter += after;
    processed += 1;

    if (after < before) {
      await writeFile(target, output);
      console.log(
        `${target}\n  ${meta.width}x${meta.height} ${kb(before)} → ` +
          `${outMeta.width}x${outMeta.height} ${kb(after)}` +
          `${isScreenshot ? "（截图：保留原尺寸）" : ""}`,
      );
    } else {
      console.log(`${target}\n  ${kb(before)} → 压缩后反而更大，保持原样`);
      totalAfter = totalAfter - after + before;
    }
  }
}

if (processed === 0) {
  console.log("没找到需要处理的 JPG 图片。");
} else {
  console.log(
    `\n合计：${kb(totalBefore)} → ${kb(totalAfter)}（省了 ${Math.round(
      (1 - totalAfter / totalBefore) * 100,
    )}%）`,
  );
}
