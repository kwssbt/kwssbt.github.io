import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    // 建议写成 "2026-09-16 21:30"（精确到分钟）。不带时区时按构建机时区解释，
    // 而构建机时区已被 astro.config.mjs 与 CI 固定为 Asia/Shanghai。
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
