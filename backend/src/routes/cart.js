import { badRequest, conflict, notFound } from '../lib/errors.js';
import { roundMoney, toCard } from '../lib/format.js';
import { requireUser } from '../plugins/auth.js';

export const getCart = (request) => request.session.get('cart') ?? [];
const saveCart = (request, cart) => request.session.set('cart', cart);

/** Pure helper: totals for a list of { price, quantity }. */
export function cartTotals(items) {
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = roundMoney(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  return { totalQty, totalPrice };
}

/** Joins the session cart (ids + quantities) with live prices and stock from the database. */
export async function loadCart(db, cart) {
  if (cart.length === 0) return { items: [], totalQty: 0, totalPrice: 0 };
  const rows = await db.query('SELECT * FROM game_catalog WHERE game_id = ANY($1)', [cart.map((c) => c.gameId)]);
  const byId = new Map(rows.map((r) => [r.game_id, r]));
  const items = cart
    .filter((c) => byId.has(c.gameId))
    .map((c) => ({ ...toCard(byId.get(c.gameId)), gameId: c.gameId, quantity: c.quantity }));
  return { items, ...cartTotals(items) };
}

const idParams = { type: 'object', properties: { gameId: { type: 'integer' } } };

export default async function cartRoutes(app) {
  const { db } = app;
  app.addHook('preHandler', requireUser);

  const stockOf = async (gameId) => {
    const row = await db.one('SELECT stock FROM game_catalog WHERE game_id = $1', [gameId]);
    if (!row) throw notFound('Game not found.');
    return row.stock;
  };

  app.get('/', async (request) => loadCart(db, getCart(request)));

  app.post('/', {
    schema: {
      body: { type: 'object', required: ['gameId'], properties: { gameId: { type: 'integer' } } },
    },
  }, async (request) => {
    const { gameId } = request.body;
    const stock = await stockOf(gameId);
    const cart = getCart(request);
    const existing = cart.find((c) => c.gameId === gameId);
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty >= stock) throw conflict('Not enough keys in stock.');

    if (existing) existing.quantity += 1;
    else cart.push({ gameId, quantity: 1 });
    saveCart(request, cart);
    return loadCart(db, cart);
  });

  app.patch('/:gameId', {
    schema: {
      params: idParams,
      body: {
        type: 'object',
        required: ['action'],
        properties: { action: { type: 'string', enum: ['increase', 'decrease'] } },
      },
    },
  }, async (request) => {
    const { gameId } = request.params;
    const cart = getCart(request);
    const item = cart.find((c) => c.gameId === gameId);
    if (!item) throw badRequest('This game is not in your cart.');

    if (request.body.action === 'increase') {
      const stock = await stockOf(gameId);
      if (item.quantity >= stock) throw conflict('Not enough keys in stock.');
      item.quantity += 1;
    } else if (item.quantity > 1) {
      item.quantity -= 1;
    }
    saveCart(request, cart);
    return loadCart(db, cart);
  });

  app.delete('/:gameId', { schema: { params: idParams } }, async (request) => {
    const cart = getCart(request).filter((c) => c.gameId !== request.params.gameId);
    saveCart(request, cart);
    return loadCart(db, cart);
  });
}
