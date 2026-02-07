/**
 * Date utility functions for the habit tracker.
 * All date keys use "YYYY-MM-DD" format.
 */

/** Returns "YYYY-MM-DD" for a given Date */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Returns "Jan, 2025" style string */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** Check if two dates are the same calendar day */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Check if a date is today */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/** Check if a date is in the past (before today) */
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

/** Check if date is today or in the future */
export function isFuture(date: Date): boolean {
  return !isPast(date) && !isToday(date);
}

/**
 * Returns 0 (Monday) through 6 (Sunday) for a given date.
 * Unlike JS getDay() which returns 0=Sunday.
 */
export function getDayOfWeek(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

/**
 * Returns an array of 7 Date objects for the week containing the given date.
 * Week starts on Monday.
 */
export function getWeekDays(date: Date): Date[] {
  const dayOfWeek = getDayOfWeek(date);
  const monday = new Date(date);
  monday.setDate(date.getDate() - dayOfWeek);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/**
 * Returns an array of dates spanning `rows` weeks (rows * 7 days)
 * ending at the end of the week containing `referenceDate`.
 * Used for the multi-row completion grid.
 */
export function getGridDays(referenceDate: Date, rows: number): Date[] {
  const totalDays = rows * 7;
  const dayOfWeek = getDayOfWeek(referenceDate);
  // Sunday of the reference week
  const sunday = new Date(referenceDate);
  sunday.setDate(referenceDate.getDate() + (6 - dayOfWeek));
  sunday.setHours(0, 0, 0, 0);

  // Go back to the start
  const startDate = new Date(sunday);
  startDate.setDate(sunday.getDate() - totalDays + 1);

  return Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });
}

/** Short day labels starting from Monday */
export const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

/**
 * Check if a habit is scheduled for a given date based on its frequency.
 * - "daily": always true
 * - "weekly": true for all days (treated as "at least once a week")
 * - "custom": true if the day index (0=Mon..6=Sun) is in frequencyDays
 */
export function isHabitScheduledForDate(
  frequency: 'daily' | 'weekly' | 'custom',
  frequencyDays: number[] | null,
  date: Date
): boolean {
  if (frequency === 'daily') return true;
  if (frequency === 'weekly') return true;
  if (frequency === 'custom' && frequencyDays) {
    return frequencyDays.includes(getDayOfWeek(date));
  }
  return false;
}
