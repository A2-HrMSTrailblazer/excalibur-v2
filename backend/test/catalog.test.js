import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { setupApp } from './helpers.js';

let ctx;
beforeAll(async () => { ctx = await setupApp(); });
afterAll(async () => { await ctx.close(); });

const get = (url) => ctx.app.inject({ url });

describe('catalog', () => {
  it('lists the 10 platforms alphabetically', async () => {
    const cats = (await get('/api/categories')).json();
    expect(cats).toHaveLength(10);
    expect(cats[0].name).toBe('Battle.net');
  });

  it('returns the three home sections', async () => {
    const home = (await get('/api/home')).json();
    expect(home.nintendo).toHaveLength(5);
    expect(home.nintendo.every((g) => g.platformName === 'Nintendo')).toBe(true);
    expect(home.topGames).toHaveLength(5);
    expect(home.topGames[0].price).toBeGreaterThanOrEqual(home.topGames[4].price);
    expect(home.recommended).toHaveLength(5);
  });

  it('pages through all 114 games, 15 per page', async () => {
    const first = (await get('/api/games')).json();
    expect(first).toMatchObject({ page: 1, total: 114, totalPages: 8 });
    expect(first.items).toHaveLength(15);
    const last = (await get('/api/games?page=8')).json();
    expect(last.items).toHaveLength(114 - 7 * 15);
  });

  it('filters by search, platforms and price range', async () => {
    const search = (await get('/api/games?search=elden')).json();
    expect(search.items.map((g) => g.name)).toContain('Elden Ring');

    const two = (await get('/api/games?platform=Nintendo&platform=Battle.net')).json();
    expect(two.items.every((g) => ['Nintendo', 'Battle.net'].includes(g.platformName))).toBe(true);

    const range = (await get('/api/games?minPrice=20&maxPrice=30')).json();
    expect(range.total).toBeGreaterThan(0);
    expect(range.items.every((g) => g.price >= 20 && g.price <= 30)).toBe(true);

    const none = (await get('/api/games?search=zzzz-no-game')).json();
    expect(none).toMatchObject({ total: 0, totalPages: 1, items: [] });
  });

  it('returns random games excluding one id', async () => {
    const games = (await get('/api/games/random?exclude=1&limit=5')).json();
    expect(games).toHaveLength(5);
    expect(games.some((g) => g.id === 1)).toBe(false);
    expect((await get('/api/games/random')).json()).toHaveLength(5);
  });

  it('returns product details with price history and reviews', async () => {
    const game = (await get('/api/games/1')).json();
    expect(game).toMatchObject({ id: 1, name: 'Elden Ring', platformName: 'Steam' });
    expect(game.priceHistory.length).toBeGreaterThan(1);
    expect(game.price).toBe(game.priceHistory.at(-1).price);
    expect(game.reviews[0]).toMatchObject({ username: 'alice_g', rating: 5 });
  });

  it('returns 404 for a missing game and 400 for a bad id', async () => {
    expect((await get('/api/games/9999')).statusCode).toBe(404);
    expect((await get('/api/games/abc')).statusCode).toBe(400);
  });

  it('returns JSON 404 for unknown api routes', async () => {
    const res = await get('/api/nothing-here');
    expect(res.statusCode).toBe(404);
    expect(res.json().message).toBe('Not found.');
  });
});
