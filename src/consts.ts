export const SITE_TITLE = "ssbt's blog";
export const SITE_DESCRIPTION = "Life is coding, and I am debugging it.";
export const SITE_AUTHOR = "ssbt";
export const SITE_GITHUB = "https://github.com/kwssbt";

/** 统一用 UTC 输出 YYYY-MM-DD，避免构建机时区影响显示日期 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: "UTC" });
}
