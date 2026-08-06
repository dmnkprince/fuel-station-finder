/**
 * Converts a raw "minutes ago" value into a compact, human-readable string.
 *
 * Examples:
 *   0    → "Just now"
 *   45   → "45m"
 *   125  → "2h 5m"
 *   1500 → "1d 1h"
 *   20200→ "2w 0d"
 *
 * @param {number} minutes - Total minutes elapsed
 * @returns {string} Formatted time-ago string
 */
export function formatTimeAgo(minutes) {
  if (minutes == null || isNaN(minutes)) return '—';

  const m = Math.round(minutes);

  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m`;

  const hours = Math.floor(m / 60);
  const remainMinutes = m % 60;

  if (hours < 24) {
    return remainMinutes > 0 ? `${hours}h ${remainMinutes}m` : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainHours = hours % 24;

  if (days < 14) {
    return remainHours > 0 ? `${days}d ${remainHours}h` : `${days}d`;
  }

  const weeks = Math.floor(days / 7);
  const remainDays = days % 7;
  return remainDays > 0 ? `${weeks}w ${remainDays}d` : `${weeks}w`;
}
