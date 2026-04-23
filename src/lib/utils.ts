import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  if (base.length === 0) return `post-${Date.now()}`;
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Arabic relative time — "منذ 3 ساعات" style */
export function timeAgoAr(input: string | Date | number): string {
  const d = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
  const diff = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));

  if (diff < 30) return "الآن";
  if (diff < 60) return `قبل ${diff} ثانية`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return plural(minutes, "دقيقة", "دقيقتين", "دقائق", "دقيقة");

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return plural(hours, "ساعة", "ساعتين", "ساعات", "ساعة");

  const days = Math.floor(hours / 24);
  if (days < 7) return plural(days, "يوم", "يومين", "أيام", "يوماً");

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return plural(weeks, "أسبوع", "أسبوعين", "أسابيع", "أسبوعاً");

  const months = Math.floor(days / 30);
  if (months < 12) return plural(months, "شهر", "شهرين", "أشهر", "شهراً");

  const years = Math.floor(days / 365);
  return plural(years, "سنة", "سنتين", "سنوات", "سنة");
}

function plural(
  n: number,
  one: string,
  two: string,
  few: string,
  many: string
): string {
  if (n === 1) return `منذ ${one}`;
  if (n === 2) return `منذ ${two}`;
  if (n >= 3 && n <= 10) return `منذ ${n} ${few}`;
  return `منذ ${n} ${many}`;
}

/** Format Arabic date (e.g. 23 أبريل 2026) */
const AR_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];
export function formatArDate(input: string | Date | number): string {
  const d = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
  return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatArTime(input: string | Date | number): string {
  const d = typeof input === "string" || typeof input === "number" ? new Date(input) : input;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatNumberAr(n: number): string {
  return n.toLocaleString("ar-EG");
}

export function readingTimeAr(content: string): string {
  const text = content.replace(/<[^>]*>/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} ${minutes === 1 ? "دقيقة" : minutes === 2 ? "دقيقتين" : minutes <= 10 ? "دقائق" : "دقيقة"}`;
}

export function excerptFromHtml(html: string, maxLen = 180): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

export function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
