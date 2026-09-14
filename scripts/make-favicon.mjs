#!/usr/bin/env node
/**
 * 从 src/assets/favicon-source.jpg 生成站点图标：
 *
 *   npm run favicon
 *
 * 换图之后重新跑一次即可。裁剪范围按源图（1080x1080，对准人物脸部）设定，
 * 如果换了尺寸不同的图，改下面的 CROP。
 */
import sharp from "sharp";

const SOURCE = "src/assets/favicon-source.jpg";

// 以源图左上角为原点的正方形裁剪框
const CROP = { left: 108, top: 22, width: 864, height: 864 };

const TARGETS = [
  { file: "public/favicon-32.png", size: 32, label: "浏览器标签页" },
  { file: "public/favicon-192.png", size: 192, label: "Android / 通用" },
  { file: "public/apple-touch-icon.png", size: 180, label: "iOS 添加到主屏" },
];

const meta = await sharp(SOURCE).metadata();
if (
  CROP.left + CROP.width > meta.width ||
  CROP.top + CROP.height > meta.height
) {
  console.error(
    `裁剪范围超出源图：源图 ${meta.width}x${meta.height}，` +
      `裁剪 ${CROP.left},${CROP.top} ${CROP.width}x${CROP.height}`,
  );
  process.exit(1);
}

for (const { file, size, label } of TARGETS) {
  const info = await sharp(SOURCE)
    .extract(CROP)
    .resize(size, size)
    .png({ palette: true, colors: 256, effort: 10 })
    .toFile(file);

  console.log(
    `${file}  ${size}x${size}  ${Math.round(info.size / 1024)}KB  ${label}`,
  );
}
