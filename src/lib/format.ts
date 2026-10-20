/** Date/time formatting helpers shared by dashboards and profiles. */

export function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Formats a stored date string as "Oct 15, 2023" (falls back to the raw text). */
export function formatDate(value?: string | null): string {
  const date = parseDate(value);
  if (!date) return value || "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Month + day parts for calendar chips. */
export function dateParts(value?: string | null): { month: string; day: string } {
  const date = parseDate(value);
  if (!date) {
    return { month: "", day: (value || "").slice(0, 10) };
  }
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: String(date.getDate()),
  };
}

/** "2 hours ago" / "Yesterday" style relative timestamps. */
export function timeAgo(value?: string | null): string {
  const date = parseDate(value);
  if (!date) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(value);
}

/** Turns an "HH:MM" string into a locale time string. */
export function formatTime(value?: string | null): string {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours)) return value;
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes ?? 0).padStart(2, "0")} ${suffix}`;
}
