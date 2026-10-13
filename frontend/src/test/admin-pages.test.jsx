import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLayout from '../pages/admin/AdminLayout.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import Products from '../pages/admin/Products.jsx';
import Categories from '../pages/admin/Categories.jsx';
import GameKeys from '../pages/admin/GameKeys.jsx';
import { OrdersPage, PaymentsPage, ReviewsPage, UsersPage } from '../pages/admin/ListPages.jsx';
import { ADMIN, EMPTY_CART, mockApi, renderPage } from './utils.jsx';

const admin = { 'GET /api/auth/me': { user: ADMIN }, 'GET /api/cart': EMPTY_CART };
const page = (items) => ({ items, page: 1, totalPages: 1, totalItems: items.length });

describe('AdminLayout', () => {
  it('shows navigation and signs out after confirming', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockApi({ ...admin, 'POST /api/auth/logout': { ok: true } });
    renderPage(<AdminLayout />, { route: '/admin', path: '/admin' });
    expect(screen.getByRole('link', { name: /Game Keys/ })).toHaveAttribute('href', '/admin/game-keys');
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await userEvent.click(screen.getByRole('button', { name: /Sign Out/ }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login'));
  });
});

describe('Dashboard', () => {
  it('shows stats, chart and top sellers', async () => {
    mockApi({
      ...admin,
      'GET /api/admin/dashboard': {
        stats: { revenue: 214.93, orders: 5, products: 114, users: 2, keys: 561 },
        salesData: { labels: ['Jul 2024', 'Aug 2024'], values: [214.93, 0] },
        topSelling: [{ name: 'Elden Ring', count: 2, percentage: 100 }],
      },
    });
    renderPage(<Dashboard />);
    expect(await screen.findByText('$214.93')).toBeInTheDocument();
    expect(screen.getByText('561')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-points', '2');
    expect(screen.getByText('2 Sold')).toBeInTheDocument();
  });
});

describe('Products', () => {
  const product = { id: 4, name: 'Hades', price: 14.99, releaseDate: '2020-09-17', description: 'Roguelike', rating: 4.95, image: 'hades.jpg', imageUrl: '/uploads/hades.jpg', categoryId: 5, categoryName: 'Epic Games', stock: 4 };

  it('lists, searches, views, adds, edits and deletes products', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { calls } = mockApi({
      ...admin,
      'GET /api/categories': [{ id: 5, name: 'Epic Games' }],
      'GET /api/admin/products': page([product]),
      'POST /api/admin/products': { status: 201, body: { id: 200 } },
      'PUT /api/admin/products/4': { ok: true },
      'DELETE /api/admin/products/4': { status: 409, body: { message: 'This product has sold keys, so it cannot be deleted.' } },
    });
    renderPage(<Products />);
    expect(await screen.findByText('Hades')).toBeInTheDocument();

    await userEvent.type(screen.getByRole('searchbox'), 'had');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => expect(calls.some((c) => c.url === '/api/admin/products?search=had&page=1')).toBe(true));

    await userEvent.click(await screen.findByRole('button', { name: 'View Hades' }));
    expect(screen.getByText('4.95 / 5')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Close' })[0]);

    await userEvent.click(screen.getByRole('button', { name: /Add Product/ }));
    const dialog = screen.getByRole('dialog', { name: 'Add Product' });
    await userEvent.type(within(dialog).getByLabelText('Product Name'), 'New Game');
    await userEvent.type(within(dialog).getByLabelText('Price (USD)'), '9.99');
    await userEvent.selectOptions(within(dialog).getByLabelText('Category'), '5');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save Product' }));
    expect(await screen.findByText('Product added.')).toBeInTheDocument();
    const post = calls.find((c) => c.method === 'POST');
    expect(post.body.get('title')).toBe('New Game');

    await userEvent.click(await screen.findByRole('button', { name: 'Edit Hades' }));
    expect(screen.getByLabelText('Product Name')).toHaveValue('Hades');
    await userEvent.click(screen.getByRole('button', { name: 'Save Product' }));
    expect(await screen.findByText('Product updated.')).toBeInTheDocument();

    await userEvent.click(await screen.findByRole('button', { name: 'Delete Hades' }));
    expect(await screen.findByText('This product has sold keys, so it cannot be deleted.')).toBeInTheDocument();
  });
});

describe('Categories', () => {
  it('adds, edits and deletes categories', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { calls } = mockApi({
      ...admin,
      'GET /api/admin/categories': page([{ id: 1, name: 'Steam', icon: 'Steam-Logo', gameCount: 37 }]),
      'POST /api/admin/categories': { status: 409, body: { message: 'A category with this name already exists.' } },
      'PUT /api/admin/categories/1': { ok: true },
      'DELETE /api/admin/categories/1': { ok: true },
    });
    renderPage(<Categories />);
    await userEvent.click(await screen.findByRole('button', { name: /Add Category/ }));
    await userEvent.type(screen.getByLabelText('Name'), 'Steam');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('A category with this name already exists.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await userEvent.click(screen.getByRole('button', { name: 'Edit Steam' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Category saved.')).toBeInTheDocument();
    expect(calls.find((c) => c.method === 'PUT').body).toEqual({ name: 'Steam', icon: 'Steam-Logo' });

    await userEvent.click(await screen.findByRole('button', { name: 'Delete Steam' }));
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('37 games'));
    expect(await screen.findByText('Category deleted.')).toBeInTheDocument();
  });
});

describe('GameKeys', () => {
  it('adds keys and only allows deleting unsold ones', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const { calls } = mockApi({
      ...admin,
      'GET /api/admin/keys': page([
        { id: 1, code: 'G001-K001', productName: 'Elden Ring', category: 'Steam', status: 'sold', date: '2024-07-01' },
        { id: 2, code: 'G001-K002', productName: 'Elden Ring', category: 'Steam', status: 'available', date: null },
      ]),
      'GET /api/admin/products/options': [{ id: 1, title: 'Elden Ring' }],
      'POST /api/admin/keys': { status: 201, body: { id: 600 } },
      'DELETE /api/admin/keys/2': { ok: true },
    });
    renderPage(<GameKeys />);
    expect(await screen.findByRole('button', { name: 'Delete key G001-K001' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: /Add Key/ }));
    await userEvent.type(screen.getByLabelText('Game Key Code'), 'NEW-1');
    await userEvent.selectOptions(await screen.findByLabelText('Product'), '1');
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Add Key' }));
    expect(await screen.findByText('Key added.')).toBeInTheDocument();
    expect(calls.find((c) => c.method === 'POST').body).toEqual({ key_code: 'NEW-1', game_id: 1 });

    await userEvent.click(await screen.findByRole('button', { name: 'Delete key G001-K002' }));
    expect(await screen.findByText('Key deleted.')).toBeInTheDocument();
  });
});

describe('read-only lists', () => {
  it('shows users with a detail modal', async () => {
    mockApi({ ...admin, 'GET /api/admin/users': page([{ userID: 1, username: 'alice_g', email: 'a@x.com', role: 'customer', registerDate: '2024-01-05', totalOrders: 3, totalSpending: 350 }]) });
    renderPage(<UsersPage />);
    await userEvent.click(await screen.findByRole('button', { name: 'View alice_g' }));
    expect(within(screen.getByRole('dialog')).getByText('$350.00')).toBeInTheDocument();
  });

  it('shows orders with their items', async () => {
    mockApi({ ...admin, 'GET /api/admin/orders': page([{ orderID: 1, username: 'alice_g', items: [{ productName: 'Hades', price: 49.99, keyCode: 'G004-K001' }], totalAmount: 89.98, paymentMethod: 'QR', status: 'Completed', orderDate: '2024-07-01' }]) });
    renderPage(<OrdersPage />);
    await userEvent.click(await screen.findByRole('button', { name: 'View order 1' }));
    expect(within(screen.getByRole('dialog')).getByText('G004-K001')).toBeInTheDocument();
  });

  it('filters payments by type', async () => {
    const { calls } = mockApi({ ...admin, 'GET /api/admin/payments': page([{ id: 9, orderID: 3, username: 'alice_g', amount: 59.99, type: 'refund', status: 'Refunded', date: null }]) });
    renderPage(<PaymentsPage />);
    expect(await screen.findByText('Refunded')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Refund' }));
    await waitFor(() => expect(calls.some((c) => c.url.includes('type=refund'))).toBe(true));
    await userEvent.click(await screen.findByRole('button', { name: 'View payment 9' }));
    expect(within(screen.getByRole('dialog')).getByText('$59.99')).toBeInTheDocument();
  });

  it('shows reviews and an empty result', async () => {
    let n = 0;
    mockApi({ ...admin, 'GET /api/admin/reviews': () => (n++ === 0 ? page([{ reviewID: 1, username: 'bob', productName: 'Celeste', rating: 4, comment: 'Lovely', date: '2024-07-16' }]) : page([])) });
    renderPage(<ReviewsPage />);
    await userEvent.click(await screen.findByRole('button', { name: 'View review 1' }));
    expect(within(screen.getByRole('dialog')).getByText('Lovely')).toBeInTheDocument();
    await userEvent.click(within(screen.getByRole('dialog')).getAllByRole('button', { name: 'Close' })[0]);
    await userEvent.type(screen.getByRole('searchbox'), 'zzz');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByText('No results found.')).toBeInTheDocument();
  });
});
