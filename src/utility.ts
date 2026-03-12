export function isoTimestamp(date?: Date): string {
  return (date ?? new Date()).toISOString().replace(/[:.]/g, '-');
}

export function stringify(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}
