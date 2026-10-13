import { describe, expect, it, vi } from 'vitest';
import { api, ApiError, toQuery } from '../api/client.js';
import { filterHistory, formatDate, formatDateTime, initial, money, onImageError, overallRating, PLACEHOLDER_IMAGE } from '../lib/format.js';
import { formatCountdown } from '../pages/client/Checkout.jsx';
import { safeReturnTo } from '../pages/client/Login.jsx';

describe('format helpers', () => {
  it('formats money and dates', () => {
    expect(money(5)).toBe('$5.00');
    expect(money(undefined)).toBe('$0.00');
    expect(formatDate('2024-07-01T10:00:00Z')).toBe('01 Jul 2024');
    expect(formatDate(null)).toBe('—');
    expect(formatDate('nope')).toBe('—');
    expect(formatDateTime('2024-07-01T10:00:00')).toContain('2024');
    expect(formatDateTime('')).toBe('—');
    expect(formatDateTime('bad')).toBe('—');
  });

  it('gets initials', () => {
    expect(initial(' bob')).toBe('B');
    expect(initial('')).toBe('?');
  });

  it('averages detailed ratings', () => {
    expect(overallRating({ a: 5, b: 4, c: 4, d: 4 })).toBe(4);
    expect(overallRating({ a: 5, b: 4 })).toBe(5);
    expect(overallRating({})).toBe(0);
  });

  it('zooms price history relative to the latest point', () => {
    const history = [
      { date: '2023-01-01', price: 60 },
      { date: '2023-10-15', price: 50 },
      { date: '2023-12-20', price: 40 },
      { date: '2024-01-01', price: 30 },
    ];
    expect(filterHistory(history, 'all')).toHaveLength(4);
    expect(filterHistory(history, '3m').map((p) => p.price)).toEqual([50, 40, 30]);
    expect(filterHistory(history, '1m').map((p) => p.price)).toEqual([40, 30]);
    expect(filterHistory([{ date: '2020-01-01', price: 1 }, { date: '2024-01-01', price: 2 }], '1m')).toHaveLength(2);
    expect(filterHistory([], '1m')).toEqual([]);
  });

  it('swaps broken images for the placeholder once', () => {
    const img = { src: 'http://x/a.jpg' };
    onImageError({ currentTarget: img });
    expect(img.src).toBe(PLACEHOLDER_IMAGE);
    img.src = `http://x${PLACEHOLDER_IMAGE}`;
    onImageError({ currentTarget: img });
    expect(img.src).toBe(`http://x${PLACEHOLDER_IMAGE}`);
  });

  it('formats the payment countdown', () => {
    expect(formatCountdown(900)).toBe('15:00');
    expect(formatCountdown(65)).toBe('01:05');
  });

  it('only allows in-site return paths after login', () => {
    expect(safeReturnTo('/cart')).toBe('/cart');
    expect(safeReturnTo('//evil.com')).toBe('/');
    expect(safeReturnTo('https://evil.com')).toBe('/');
    expect(safeReturnTo(null)).toBe('/');
  });
});

describe('api client', () => {
  it('builds query strings', () => {
    expect(toQuery({})).toBe('');
    expect(toQuery({ search: 'mario', platform: ['Steam', 'Nintendo'], minPrice: '', page: 2 }))
      .toBe('?search=mario&platform=Steam&platform=Nintendo&page=2');
  });

  it('sends JSON and returns data', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await api('/x', { method: 'POST', body: { a: 1 } })).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith('/api/x', expect.objectContaining({ method: 'POST', body: '{"a":1}' }));
  });

  it('sends FormData without a JSON header', async () => {
    const fetchMock = vi.fn(async () => new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const form = new FormData();
    await api('/upload', { method: 'POST', form });
    expect(fetchMock.mock.calls[0][1].headers).toEqual({});
    expect(fetchMock.mock.calls[0][1].body).toBe(form);
  });

  it('throws ApiError with the server message or a fallback', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ message: 'Nope' }), { status: 409 })));
    await expect(api('/x')).rejects.toMatchObject({ status: 409, message: 'Nope' });
    vi.stubGlobal('fetch', vi.fn(async () => new Response('not json', { status: 500 })));
    const err = await api('/x').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).toBe('Request failed (500)');
  });
});
