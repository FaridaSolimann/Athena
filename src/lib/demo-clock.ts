// The workspace clock. All date math in Athena flows through this module so
// relative framing ("in 13 days") stays consistent everywhere.
export const TODAY_ISO = "2026-07-19";

export const MS_PER_DAY = 86_400_000;

/** Parse an ISO date (YYYY-MM-DD) as UTC midnight. */
export function parseISO(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export const TODAY = parseISO(TODAY_ISO);

/** Whole days from today to the given ISO date (negative = past). */
export function daysFromToday(iso: string): number {
  return Math.round((parseISO(iso).getTime() - TODAY.getTime()) / MS_PER_DAY);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(parseISO(iso).getTime() + days * MS_PER_DAY);
  return d.toISOString().slice(0, 10);
}

export function isWithinDays(iso: string, days: number): boolean {
  const delta = daysFromToday(iso);
  return delta >= 0 && delta <= days;
}
