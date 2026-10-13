import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider } from '../context/CartContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';

export const ALICE = { id: 1, username: 'alice_g', email: 'alice.gamer@gmail.com', role: 'customer' };
export const ADMIN = { id: 3, username: 'admin', email: 'admin@excalibur.com', role: 'admin' };
export const EMPTY_CART = { items: [], totalQty: 0, totalPrice: 0 };

export const game = (id, extra = {}) => ({
  id, name: `Game ${id}`, image: `/uploads/g${id}.jpg`, platformName: 'Steam', platformIcon: '/asset/client/icon/Steam-Logo.png',
  region: 'GLOBAL', price: 10 + id, stock: 3, ...extra,
});

/**
 * Stubs global fetch. `routes` maps "METHOD /api/path?query" (or without the query) to a body,
 * { status, body }, or a function (request) => body | { status, body }.
 */
export function mockApi(routes) {
  const calls = [];
  const fetchMock = vi.fn(async (url, options = {}) => {
    const method = options.method ?? 'GET';
    const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
    calls.push({ method, url, body });
    const path = url.split('?')[0];
    let handler = routes[`${method} ${url}`] ?? routes[`${method} ${path}`];
    if (typeof handler === 'function') handler = await handler({ method, url, body });
    if (handler === undefined) return new Response(JSON.stringify({ message: `No mock for ${method} ${url}` }), { status: 404 });
    const isWrapped = handler && typeof handler === 'object' && 'status' in handler && 'body' in handler;
    const status = isWrapped ? handler.status : 200;
    const payload = isWrapped ? handler.body : handler;
    return new Response(JSON.stringify(payload), { status, headers: { 'Content-Type': 'application/json' } });
  });
  vi.stubGlobal('fetch', fetchMock);
  return { calls, fetchMock };
}

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
}

/** Renders `element` at `path` inside all app providers, with a route table for navigation targets. */
export function renderPage(element, { route = '/', path = '/', extraRoutes = [] } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              <Route path={path} element={element} />
              {extraRoutes.map(([p, el]) => <Route key={p} path={p} element={el} />)}
              <Route path="*" element={<div>other page</div>} />
            </Routes>
            <LocationProbe />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
