export function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(' ') || '0m';
}

export function parseDuration(str) {
  const match = str.match(/(?:(\d+)h)?\s*(\d+)m/);
  if (!match) return 0;
  return Number(match[1] || 0) * 60 + Number(match[2]);
}

export function formatDurationWithZeros(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  parts.push(`${m.toString().padStart(2, '0')}m`);
  return parts.join(' ');
}
