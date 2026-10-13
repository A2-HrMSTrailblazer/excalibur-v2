export const imageUrl = (img) => {
  if (!img) return '/asset/client/placeholder.svg';
  return img.startsWith('http') ? img : `/uploads/${img}`;
};

export const platformIconUrl = (icon) => (icon ? `/asset/client/icon/${icon}.png` : null);

/** Shape of a product card used by the home, store, cart and review pages. */
export function toCard(row) {
  return {
    id: row.game_id,
    name: row.title,
    image: imageUrl(row.img),
    platformName: row.platform_name,
    platformIcon: platformIconUrl(row.platform_icon),
    region: 'GLOBAL',
    price: Number(row.price ?? 0),
    stock: Number(row.stock ?? 0),
  };
}

export const roundMoney = (value) => Math.round(Number(value) * 100) / 100;

const ORDER_STATUS = { paid: 'Completed', pending: 'Pending', failed: 'Failed', refunded: 'Refunded' };
export const orderStatusLabel = (status) => ORDER_STATUS[status] ?? 'Unknown';

const TRANSACTION_STATUS = { purchase: 'Success', refund: 'Refunded', deposit: 'Completed', withdrawal: 'Completed' };
export const transactionStatusLabel = (type) => TRANSACTION_STATUS[type] ?? 'Unknown';

/** Turns a string query value or repeated value into a clean array. */
export function toList(value) {
  if (value === undefined || value === null || value === '') return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((v) => String(v).trim()).filter(Boolean);
}

export function parseOptionalNumber(value) {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function slugify(text) {
  const slug = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || 'game';
}
