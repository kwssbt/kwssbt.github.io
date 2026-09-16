export const SITE_TITLE = "ZJ";
export const SITE_DESCRIPTION = "For a big dream or for nothing.";
export const SITE_AUTHOR = "ssbt";
export const SITE_GITHUB = "https://github.com/kwssbt";

/** 站点时区：文章时间按它解释、也按它显示 */
export const SITE_TIMEZONE = "Asia/Shanghai";

/** 统一按北京时间输出 YYYY-MM-DD HH:mm，不受构建机时区影响 */
export function formatDateTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("year")}-${value("month")}-${value("day")} ${value("hour")}:${value("minute")}`;
}
