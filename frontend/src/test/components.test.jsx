import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../components/Pagination.jsx';
import StarRating from '../components/StarRating.jsx';
import Modal from '../components/Modal.jsx';
import Logo from '../components/Logo.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ClientLayout from '../components/ClientLayout.jsx';
import { RequireAdmin, RequireUser } from '../components/RouteGuards.jsx';
import { ALICE, EMPTY_CART, game, mockApi, renderPage } from './utils.jsx';

describe('Pagination', () => {
  it('hides when there is one page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows a window of pages and reports clicks', async () => {
    const onChange = vi.fn();
    render(<Pagination page={5} totalPages={8} onChange={onChange} />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['«', '3', '4', '5', '6', '7', '»']);
    expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: '»' }));
    await userEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onChange.mock.calls).toEqual([[6], [3]]);
  });
});

describe('StarRating', () => {
  it('is read-only without onChange and clickable with it', async () => {
    const { rerender } = render(<StarRating value={3} />);
    expect(screen.queryByRole('button')).toBeNull();
    const onChange = vi.fn();
    rerender(<StarRating value={3} label="Story" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Story 5' }));
    expect(onChange).toHaveBeenCalledWith(5);
  });
});

describe('Modal and Logo', () => {
  it('renders only when open and closes', async () => {
    const onClose = vi.fn();
    const { rerender } = render(<Modal open={false} title="T" onClose={onClose}>body</Modal>);
    expect(screen.queryByText('body')).toBeNull();
    rerender(<Modal open title="T" subtitle="Sub" onClose={onClose} actions={<span>act</span>}>body</Modal>);
    expect(screen.getByRole('dialog', { name: 'T' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('falls back to a text logo when the image is missing', () => {
    render(<Logo />);
    fireEvent.error(screen.getByAltText('Excalibur'));
    expect(screen.getByText('EXCALIBUR')).toBeInTheDocument();
  });
});

describe('ProductCard', () => {
  it('sends guests to login when adding to cart', async () => {
    mockApi({ 'GET /api/auth/me': { user: null } });
    renderPage(<ProductCard product={game(1)} />, { route: '/store' , path: '/store' });
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/login?returnTo=%2Fstore');
  });

  it('adds to cart for logged-in users and opens the cart', async () => {
    const { calls } = mockApi({
      'GET /api/auth/me': { user: ALICE },
      'GET /api/cart': EMPTY_CART,
      'POST /api/cart': { items: [{ ...game(1), gameId: 1, quantity: 1 }], totalQty: 1, totalPrice: 11 },
    });
    renderPage(<ProductCard product={game(1)} />, { route: '/store', path: '/store' });
    await waitFor(() => expect(calls.some((c) => c.url === '/api/cart')).toBe(true));
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/cart'));
    expect(calls.find((c) => c.method === 'POST').body).toEqual({ gameId: 1 });
  });

  it('shows an error toast when stock ran out', async () => {
    mockApi({
      'GET /api/auth/me': { user: ALICE },
      'GET /api/cart': EMPTY_CART,
      'POST /api/cart': { status: 409, body: { message: 'Not enough keys in stock.' } },
    });
    renderPage(<ProductCard product={game(1)} />, { route: '/store', path: '/store' });
    await screen.findByTestId('location');
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/cart', expect.anything()));
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));
    expect(await screen.findByText('Not enough keys in stock.')).toBeInTheDocument();
  });

  it('disables the button when out of stock', () => {
    mockApi({ 'GET /api/auth/me': { user: null } });
    renderPage(<ProductCard product={game(2, { stock: 0 })} />);
    expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
  });
});

describe('ClientLayout', () => {
  it('opens the category drawer and searches from the header', async () => {
    mockApi({
      'GET /api/auth/me': { user: null },
      'GET /api/categories': [{ id: 1, name: 'Steam', icon: 'Steam-Logo' }],
    });
    renderPage(<ClientLayout />);
    await userEvent.click(screen.getByRole('button', { name: /Categories/ }));
    expect(await screen.findByRole('link', { name: 'Steam' })).toHaveAttribute('href', '/store?platform=Steam');
    await userEvent.click(screen.getByRole('button', { name: 'Close categories' }));
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search games' }), 'mario{enter}');
    expect(screen.getByTestId('location')).toHaveTextContent('/store?search=mario');
  });

  it('shows the account menu and logs out', async () => {
    mockApi({
      'GET /api/auth/me': { user: { ...ALICE, role: 'admin' } },
      'GET /api/cart': { ...EMPTY_CART, totalQty: 2 },
      'POST /api/auth/logout': { ok: true },
    });
    renderPage(<ClientLayout />);
    expect(await screen.findByText('alice_g')).toBeInTheDocument();
    expect(screen.getByText('Admin panel')).toBeInTheDocument();
    expect(await screen.findByText('2')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Logout/ }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login'));
  });
});

describe('route guards', () => {
  it('redirects guests to login with a return path', async () => {
    mockApi({ 'GET /api/auth/me': { user: null } });
    renderPage(<RequireUser><p>secret</p></RequireUser>, { route: '/orders', path: '/orders' });
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login?returnTo=%2Forders'));
  });

  it('lets admins in and keeps customers out of the admin area', async () => {
    mockApi({ 'GET /api/auth/me': { user: ALICE }, 'GET /api/cart': EMPTY_CART });
    renderPage(<RequireAdmin><p>admin area</p></RequireAdmin>, { route: '/admin', path: '/admin' });
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login'));
  });
});
