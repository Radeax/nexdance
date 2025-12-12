/**
 * Formats seconds into MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "2:05")
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parses a time string into seconds
 * @param timeStr - Time string in format "MM:SS" or raw seconds
 * @returns Time in seconds
 */
export function parseTime(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  return parseInt(timeStr, 10) || 0;
}
