import { describe, expect, it } from 'vitest';
import {
  imageUrl, orderStatusLabel, parseOptionalNumber, platformIconUrl, roundMoney, slugify, toCard, toList,
  transactionStatusLabel,
} from '../src/lib/format.js';
import { likePattern, parsePaging, toPage } from '../src/lib/pagination.js';
import { parseProductFields } from '../src/lib/validate.js';
import { HttpError, isUniqueViolation, unauthorized } from '../src/lib/errors.js';
import { cartTotals } from '../src/routes/cart.js';
import { groupOrders } from '../src/routes/orders.js';
import { uniqueUsername } from '../src/routes/auth.js';

describe('format helpers', () => {
  it('builds image urls for local, remote and missing images', () => {
    expect(imageUrl('a.jpg')).toBe('/uploads/a.jpg');
    expect(imageUrl('https://x.com/a.jpg')).toBe('https://x.com/a.jpg');
    expect(imageUrl(null)).toBe('/asset/client/placeholder.svg');
  });

  it('builds platform icon urls', () => {
    expect(platformIconUrl('Steam-Logo')).toBe('/asset/client/icon/Steam-Logo.png');
    expect(platformIconUrl(null)).toBeNull();
  });

  it('maps a catalog row to a product card', () => {
    const card = toCard({ game_id: 1, title: 'X', img: 'x.jpg', platform_name: 'Steam', platform_icon: 'Steam-Logo', price: '9.99', stock: '3' });
    expect(card).toMatchObject({ id: 1, name: 'X', price: 9.99, stock: 3, region: 'GLOBAL' });
    expect(toCard({ game_id: 2, title: 'Y' })).toMatchObject({ price: 0, stock: 0 });
  });

  it('rounds money to 2 decimals', () => {
    expect(roundMoney(0.1 + 0.2)).toBe(0.3);
    expect(roundMoney('10.005')).toBe(10.01);
  });

  it('maps order and transaction statuses', () => {
    expect(orderStatusLabel('paid')).toBe('Completed');
    expect(orderStatusLabel('pending')).toBe('Pending');
    expect(orderStatusLabel('weird')).toBe('Unknown');
    expect(transactionStatusLabel('purchase')).toBe('Success');
    expect(transactionStatusLabel('refund')).toBe('Refunded');
    expect(transactionStatusLabel('nope')).toBe('Unknown');
  });

  it('normalises list query values', () => {
    expect(toList(undefined)).toEqual([]);
    expect(toList('')).toEqual([]);
    expect(toList('Steam')).toEqual(['Steam']);
    expect(toList(['Steam', ' ', 'Nintendo '])).toEqual(['Steam', 'Nintendo']);
  });

  it('parses optional numbers', () => {
    expect(parseOptionalNumber('')).toBeNull();
    expect(parseOptionalNumber(undefined)).toBeNull();
    expect(parseOptionalNumber('abc')).toBeNull();
    expect(parseOptionalNumber('12.5')).toBe(12.5);
  });

  it('slugifies titles', () => {
    expect(slugify('Elden Ring: Shadow')).toBe('elden-ring-shadow');
    expect(slugify('')).toBe('game');
    expect(slugify('!!!')).toBe('game');
  });
});

describe('pagination helpers', () => {
  it('parses page and limit with sane bounds', () => {
    expect(parsePaging({})).toEqual({ page: 1, limit: 10, offset: 0 });
    expect(parsePaging({ page: '3', limit: '5' })).toEqual({ page: 3, limit: 5, offset: 10 });
    expect(parsePaging({ page: '-2', limit: '1000' })).toEqual({ page: 1, limit: 100, offset: 0 });
  });

  it('builds a page with a window of page numbers', () => {
    const rows = [{ id: 1, total_count: '45' }];
    const page = toPage(rows, { page: 5, limit: 10 }, (r) => r.id);
    expect(page).toMatchObject({ items: [1], totalItems: 45, totalPages: 5, startPage: 3, endPage: 5 });
    expect(toPage([], { page: 1, limit: 10 })).toMatchObject({ totalItems: 0, totalPages: 1 });
  });

  it('builds LIKE patterns', () => {
    expect(likePattern(' mario ')).toBe('%mario%');
    expect(likePattern(undefined)).toBe('%%');
  });
});

describe('product form validation', () => {
  it('accepts a valid form', () => {
    expect(parseProductFields({ title: ' Game ', price: '10.456', release_date: '2024-01-01', category_id: '2', description: 'd' }))
      .toEqual({ title: 'Game', price: 10.46, releaseDate: '2024-01-01', categoryId: 2, description: 'd' });
    expect(parseProductFields({ title: 'G', price: '0' })).toMatchObject({ releaseDate: null, categoryId: null, description: null });
  });

  it.each([
    [{ price: '1' }, 'Product name is required.'],
    [{ title: 'x'.repeat(151), price: '1' }, 'Product name is too long.'],
    [{ title: 'G', price: '-1' }, 'Price must be a number of 0 or more.'],
    [{ title: 'G', price: 'abc' }, 'Price must be a number of 0 or more.'],
    [{ title: 'G', price: '1', release_date: 'not-a-date' }, 'Release date is not valid.'],
    [{ title: 'G', price: '1', category_id: 'abc' }, 'Category is not valid.'],
  ])('rejects %o', (fields, message) => {
    expect(() => parseProductFields(fields)).toThrow(message);
  });
});

describe('errors', () => {
  it('creates http errors with status codes', () => {
    const err = unauthorized();
    expect(err).toBeInstanceOf(HttpError);
    expect(err.statusCode).toBe(401);
    expect(isUniqueViolation({ code: '23505' })).toBe(true);
    expect(isUniqueViolation(null)).toBe(false);
  });
});

describe('cart and order helpers', () => {
  it('totals a cart', () => {
    expect(cartTotals([])).toEqual({ totalQty: 0, totalPrice: 0 });
    expect(cartTotals([{ price: 9.99, quantity: 2 }, { price: 0.01, quantity: 1 }])).toEqual({ totalQty: 3, totalPrice: 19.99 });
  });

  it('groups order rows by order and game', () => {
    const base = { order_id: 1, order_date: '2024-01-01', game_id: 7, title: 'G', img: 'g.jpg', platform_name: 'Steam', purchase_price: '10.00' };
    const orders = groupOrders([
      { ...base, key_code: 'K1' },
      { ...base, key_code: 'K2' },
      { ...base, game_id: 8, title: 'H', key_code: 'K3', purchase_price: '5.50' },
      { ...base, order_id: 2, key_code: 'K4' },
    ]);
    expect(orders).toHaveLength(2);
    expect(orders[0].total).toBe(25.5);
    expect(orders[0].items[0]).toMatchObject({ quantity: 2, keys: ['K1', 'K2'], image: '/uploads/g.jpg' });
  });
});

describe('uniqueUsername', () => {
  const fakeDb = (names) => ({ query: async () => names.map((username) => ({ username })) });

  it('returns the base name when it is free', async () => {
    expect(await uniqueUsername(fakeDb([]), 'neo')).toBe('neo');
  });

  it('adds the next free number when taken', async () => {
    expect(await uniqueUsername(fakeDb(['neo', 'neo2']), 'neo')).toBe('neo3');
  });

  it('strips symbols and falls back to "player"', async () => {
    expect(await uniqueUsername(fakeDb([]), 'a.b+c')).toBe('abc');
    expect(await uniqueUsername(fakeDb([]), '...')).toBe('player');
  });
});
