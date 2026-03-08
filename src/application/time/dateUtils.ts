const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function weekdayLabel(date: Date): string {
  return WEEKDAY_LABELS[date.getDay()];
}

// Monday as start of week.
export function startOfWeekMonday(date: Date): Date {
  const day = date.getDay();
  const daysFromMonday = (day + 6) % 7; // Mon=0, Tue=1, ..., Sun=6
  return startOfDay(addDays(date, -daysFromMonday));
}
