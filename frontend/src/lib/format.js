export const money = (value) => `$${Number(value ?? 0).toFixed(2)}`;

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const initial = (name) => (name ? name.trim().charAt(0).toUpperCase() : '?');

/** Price-history zoom: keep points within `months` of the latest point ("all" keeps everything). */
export function filterHistory(history, range) {
  if (range === 'all' || history.length === 0) return history;
  const months = range === '1m' ? 1 : 3;
  const last = new Date(history.at(-1).date);
  const from = new Date(last);
  from.setMonth(from.getMonth() - months);
  const inRange = history.filter((p) => new Date(p.date) >= from);
  // Always show at least the last two points so the chart still draws a line.
  return inRange.length >= 2 ? inRange : history.slice(-2);
}

/** Overall rating = rounded average of the detailed ratings (same as the old review.js). */
export function overallRating(scores) {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export const USERNAME_PATTERN = /^[A-Za-z0-9_]{6,20}$/;
export const MIN_REVIEW_LENGTH = 150;

export const ORDER_STATUS_BADGE = {
  Completed: 'badge-success',
  Pending: 'badge-warning',
  Refunded: 'badge-error',
  Failed: 'badge-error',
};

export const PAYMENT_TYPE_BADGE = {
  deposit: 'badge-info',
  purchase: 'badge-success',
  refund: 'badge-error',
  withdrawal: 'badge-neutral',
};

export const PLACEHOLDER_IMAGE = '/asset/client/placeholder.svg';

/** <img onError> handler that swaps in the placeholder once. */
export function onImageError(event) {
  const img = event.currentTarget;
  if (!img.src.endsWith(PLACEHOLDER_IMAGE)) img.src = PLACEHOLDER_IMAGE;
}
