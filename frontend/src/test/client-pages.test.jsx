import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../pages/client/Home.jsx';
import Store from '../pages/client/Store.jsx';
import ProductDetail from '../pages/client/ProductDetail.jsx';
import Cart from '../pages/client/Cart.jsx';
import Checkout from '../pages/client/Checkout.jsx';
import Orders from '../pages/client/Orders.jsx';
import Profile from '../pages/client/Profile.jsx';
import Review from '../pages/client/Review.jsx';
import Login from '../pages/client/Login.jsx';
import Register from '../pages/client/Register.jsx';
import { About, Contact, NotFound } from '../pages/client/StaticPages.jsx';
import { ALICE, EMPTY_CART, game, mockApi, renderPage } from './utils.jsx';

const guest = { 'GET /api/auth/me': { user: null } };
const alice = { 'GET /api/auth/me': { user: ALICE } };
const cartWith = (...items) => ({
  items,
  totalQty: items.reduce((s, i) => s + i.quantity, 0),
  totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0),
});
const line = (id, quantity = 1, extra = {}) => ({ ...game(id), gameId: id, quantity, ...extra });

describe('Home', () => {
  it('shows the three product sections', async () => {
    mockApi({ ...guest, 'GET /api/home': { nintendo: [game(1)], topGames: [game(2)], recommended: [game(3)] } });
    renderPage(<Home />);
    expect(await screen.findByText('Nintendo Game')).toBeInTheDocument();
    expect(screen.getByText('Top games')).toBeInTheDocument();
    expect(screen.getByText('Game 3')).toBeInTheDocument();
  });

  it('shows an error with retry', async () => {
    mockApi({ ...guest, 'GET /api/home': { status: 500, body: { message: 'Server down' } } });
    renderPage(<Home />);
    expect(await screen.findByText('Server down')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});

describe('Store', () => {
  const categories = [{ id: 1, name: 'Steam' }, { id: 10, name: 'Nintendo' }];

  it('loads games for the URL filters and applies new filters', async () => {
    const { calls } = mockApi({
      ...guest,
      'GET /api/categories': categories,
      'GET /api/games': ({ url }) => ({ items: [game(1)], page: 1, totalPages: 2, total: 16, url }),
    });
    renderPage(<Store />, { route: '/store?search=elden', path: '/store' });
    expect(await screen.findByText('Results for “elden”')).toBeInTheDocument();
    expect(screen.getByText('16 games found')).toBeInTheDocument();
    expect(calls.some((c) => c.url === '/api/games?search=elden&page=1')).toBe(true);

    await userEvent.click(await screen.findByRole('checkbox', { name: 'Nintendo' }));
    await userEvent.type(screen.getByLabelText('Minimum price'), '5');
    await userEvent.type(screen.getByLabelText('Maximum price'), '30');
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/store?search=elden&platform=Nintendo&minPrice=5&maxPrice=30'));
    await waitFor(() => expect(calls.some((c) => c.url.includes('platform=Nintendo&minPrice=5&maxPrice=30'))).toBe(true));

    await userEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByTestId('location')).toHaveTextContent('page=2');

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByTestId('location')).toHaveTextContent(/\/store\?search=elden$/);
  });

  it('titles the page by platform and shows an empty state', async () => {
    mockApi({ ...guest, 'GET /api/categories': categories, 'GET /api/games': { items: [], page: 1, totalPages: 1, total: 0 } });
    renderPage(<Store />, { route: '/store?platform=Steam', path: '/store' });
    expect(await screen.findByText('No games found')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Steam' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Steam' }));
    expect(screen.getByRole('checkbox', { name: 'Steam' })).not.toBeChecked();
  });
});

describe('ProductDetail', () => {
  const detail = {
    ...game(1, { name: 'Elden Ring', price: 29.99, stock: 4 }),
    description: 'Big world.',
    priceHistory: [
      { date: '2022-02-25', price: 59.99 }, { date: '2023-06-15', price: 39.99 }, { date: '2024-01-01', price: 29.99 },
    ],
    reviews: [{ id: 1, username: 'alice_g', rating: 5, comment: 'Great', date: '2024-07-02' }],
  };

  it('shows price, chart zoom and reviews', async () => {
    mockApi({ ...guest, 'GET /api/games/1': detail });
    renderPage(<ProductDetail />, { route: '/product/1', path: '/product/:id' });
    expect(await screen.findByRole('heading', { name: 'Elden Ring' })).toBeInTheDocument();
    expect(screen.getByText('In Stock: 4 keys available')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toHaveAttribute('data-points', '3');
    await userEvent.click(screen.getByRole('button', { name: '1m' }));
    expect(screen.getByTestId('line-chart')).toHaveAttribute('data-points', '2');
    expect(screen.getByText('Great')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Write a review' })).toHaveAttribute('href', '/login?returnTo=%2Freview%2F1');
  });

  it('handles out of stock, no reviews and missing games', async () => {
    mockApi({ ...alice, 'GET /api/cart': EMPTY_CART, 'GET /api/games/1': { ...detail, stock: 0, reviews: [] }, 'GET /api/games/2': { status: 404, body: { message: 'Game not found.' } } });
    const { unmount } = renderPage(<ProductDetail />, { route: '/product/1', path: '/product/:id' });
    expect(await screen.findByText(/Out of Stock \(Check back later\)/)).toBeInTheDocument();
    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Write a review' })).toHaveAttribute('href', '/review/1');
    unmount();
    renderPage(<ProductDetail />, { route: '/product/2', path: '/product/:id' });
    expect(await screen.findByText('Game not found')).toBeInTheDocument();
  });
});

describe('Cart', () => {
  it('shows the empty cart', async () => {
    mockApi({ ...alice, 'GET /api/cart': EMPTY_CART, 'GET /api/games/random': [] });
    renderPage(<Cart />);
    expect(await screen.findByText('Your cart is empty')).toBeInTheDocument();
  });

  it('changes quantities, removes items and goes to checkout', async () => {
    const { calls } = mockApi({
      ...alice,
      'GET /api/cart': cartWith(line(1, 1)),
      'PATCH /api/cart/1': cartWith(line(1, 2)),
      'DELETE /api/cart/1': EMPTY_CART,
      'GET /api/games/random': [game(5)],
    });
    renderPage(<Cart />);
    expect(await screen.findByRole('button', { name: 'Increase Game 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decrease Game 1' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Increase Game 1' }));
    await waitFor(() => expect(screen.getByLabelText('Quantity')).toHaveTextContent('2'));
    expect(calls.find((c) => c.method === 'PATCH').body).toEqual({ action: 'increase' });
    expect(await screen.findByText('You may also like')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Checkout' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/checkout');
  });

  it('shows server errors from cart actions', async () => {
    mockApi({
      ...alice,
      'GET /api/cart': cartWith(line(1, 1)),
      'DELETE /api/cart/1': { status: 500, body: { message: 'Could not remove' } },
      'GET /api/games/random': [],
    });
    renderPage(<Cart />);
    await userEvent.click(await screen.findByRole('button', { name: 'Remove Game 1' }));
    expect(await screen.findByText('Could not remove')).toBeInTheDocument();
  });
});

describe('Checkout', () => {
  const methods = [{ id: 'QR', name: 'QR PromptPay', logo: '/qr.png' }, { id: 'TRUEMONEY', name: 'TrueMoney Wallet', logo: '/tm.png' }];

  it('redirects to the cart when it is empty', async () => {
    mockApi({ ...alice, 'GET /api/cart': EMPTY_CART, 'GET /api/checkout/payment-methods': methods });
    renderPage(<Checkout />, { route: '/checkout', path: '/checkout' });
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/cart'));
  });

  it('opens the payment modal for each method and places the order', async () => {
    let cartCalls = 0;
    const { calls } = mockApi({
      ...alice,
      'GET /api/cart': () => (cartCalls++ < 1 ? cartWith(line(1, 2, { price: 10 })) : EMPTY_CART),
      'GET /api/checkout/payment-methods': methods,
      'POST /api/checkout': { status: 201, body: { orderId: 9, totalAmount: 20 } },
    });
    renderPage(<Checkout />, { route: '/checkout', path: '/checkout' });

    await userEvent.click(await screen.findByRole('button', { name: 'Continue' }));
    const dialog = screen.getByRole('dialog', { name: 'Complete Payment' });
    expect(within(dialog).getByText('$20.00')).toBeInTheDocument();
    expect(within(dialog).getByAltText('PromptPay QR')).toHaveAttribute('src', 'https://promptpay.io/0855980368/20.00.png');
    expect(within(dialog).getByText('15:00')).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }));

    await userEvent.click(screen.getByRole('radio', { name: 'TrueMoney Wallet' }));
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('096-174-8554')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'I have transferred the money' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/orders'));
    expect(calls.find((c) => c.url === '/api/checkout').body).toEqual({ paymentMethod: 'TRUEMONEY' });
  });

  it('shows an error when checkout fails', async () => {
    mockApi({
      ...alice,
      'GET /api/cart': cartWith(line(1, 1)),
      'GET /api/checkout/payment-methods': methods,
      'POST /api/checkout': { status: 409, body: { message: 'Out of stock for game: Game 1' } },
    });
    renderPage(<Checkout />, { route: '/checkout', path: '/checkout' });
    await userEvent.click(await screen.findByRole('button', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('button', { name: 'I have transferred the money' }));
    expect(await screen.findByText('Out of stock for game: Game 1')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('Orders', () => {
  it('lists orders with their keys', async () => {
    mockApi({
      ...alice,
      'GET /api/cart': EMPTY_CART,
      'GET /api/orders': [{
        orderId: 7, orderDate: '2024-07-01T10:00:00', total: 20,
        items: [{ gameId: 1, name: 'Elden Ring', image: '/x.jpg', platformName: 'Steam', price: 10, quantity: 2, keys: ['K1', 'K2'] }],
      }],
    });
    renderPage(<Orders />);
    expect(await screen.findByText('Order #7')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy key K2' })).toBeInTheDocument();
    expect(screen.getByText('Total: $20.00')).toBeInTheDocument();
  });

  it('shows an empty state', async () => {
    mockApi({ ...alice, 'GET /api/cart': EMPTY_CART, 'GET /api/orders': [] });
    renderPage(<Orders />);
    expect(await screen.findByText('No orders yet')).toBeInTheDocument();
  });
});

describe('Profile', () => {
  it('validates and saves the username', async () => {
    let attempt = 0;
    mockApi({
      ...alice,
      'GET /api/cart': EMPTY_CART,
      'GET /api/profile': { ...ALICE, totalSpend: 350, registerDate: '2024-01-05' },
      'PATCH /api/profile': ({ body }) => (attempt++ === 0
        ? { status: 409, body: { message: 'taken' } }
        : { user: { ...ALICE, username: body.username } }),
    });
    renderPage(<RequireUserWrapper />);
    const input = await screen.findByLabelText('Username');
    expect(await screen.findByText('$350.00')).toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, 'ab cd');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(screen.getByRole('status')).toHaveTextContent('6-20 letters');

    await userEvent.clear(input);
    await userEvent.type(input, 'bob_plays');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Username already taken.')).toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, 'alice_new');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Username updated successfully!')).toBeInTheDocument();
  });
});

// Profile reads the logged-in user from context, so render it only after /auth/me resolves.
function RequireUserWrapper() {
  return <ProfileWhenReady />;
}
import { useAuth } from '../context/AuthContext.jsx';
function ProfileWhenReady() {
  const { user } = useAuth();
  return user ? <Profile /> : null;
}

describe('Review', () => {
  it('needs 150 characters and posts the averaged rating', async () => {
    const { calls } = mockApi({
      ...alice,
      'GET /api/cart': EMPTY_CART,
      'GET /api/games/1': { ...game(1), description: 'd', priceHistory: [], reviews: [] },
      'GET /api/games/random': [game(4)],
      'POST /api/games/1/reviews': { ok: true },
    });
    renderPage(<ReviewWhenReady />, { route: '/review/1', path: '/review/:id' });
    const textarea = await screen.findByLabelText('Review text');
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    expect(confirm).toBeDisabled();
    expect(screen.getByText('150 more characters needed')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Story 1' }));
    await userEvent.click(screen.getByRole('button', { name: 'Graphics 2' }));
    await userEvent.type(textarea, 'x'.repeat(150));
    expect(screen.getByText('Looks good!')).toBeInTheDocument();
    await userEvent.click(confirm);
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/product/1'));
    // (5 + 1 + 2 + 5) / 4 = 3.25 -> 3
    expect(calls.find((c) => c.method === 'POST').body.rating).toBe(3);
  });
});
function ReviewWhenReady() {
  const { user } = useAuth();
  return user ? <Review /> : null;
}

describe('Login and Register', () => {
  it('logs in and follows returnTo', async () => {
    mockApi({ ...guest, 'POST /api/auth/login': { user: ALICE }, 'GET /api/cart': EMPTY_CART });
    renderPage(<Login />, { route: '/login?returnTo=%2Fcart', path: '/login' });
    await userEvent.type(screen.getByLabelText('Username or email'), 'alice.gamer@gmail.com');
    await userEvent.type(screen.getByLabelText('Password'), 'pw');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/cart'));
  });

  it('sends admins to the dashboard and shows bad logins', async () => {
    let n = 0;
    mockApi({
      ...guest,
      'POST /api/auth/login': () => (n++ === 0 ? { status: 401, body: { message: 'x' } } : { user: { ...ALICE, role: 'admin' } }),
      'GET /api/cart': EMPTY_CART,
    });
    renderPage(<Login />, { route: '/login?registered=1', path: '/login' });
    expect(screen.getByText('Account created. Please log in.')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Username or email'), 'admin@excalibur.com');
    await userEvent.type(screen.getByLabelText('Password'), 'bad');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(await screen.findByText('Invalid email or password. Please try again.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/admin/dashboard'));
  });

  it('registers with matching passwords only', async () => {
    let n = 0;
    mockApi({ ...guest, 'POST /api/auth/register': () => (n++ === 0 ? { status: 409, body: { message: 'This email is already registered.' } } : { status: 201, body: { ok: true } }) });
    renderPage(<Register />, { route: '/register', path: '/register' });
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
    await userEvent.type(screen.getByLabelText('Password'), 'secret1');
    await userEvent.type(screen.getByLabelText('Confirm password'), 'secret2');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match.');

    await userEvent.clear(screen.getByLabelText('Confirm password'));
    await userEvent.type(screen.getByLabelText('Confirm password'), 'secret1');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(await screen.findByText('This email is already registered.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/login?registered=1'));
  });
});

describe('static pages', () => {
  it('render their content', () => {
    mockApi(guest);
    renderPage(<><About /><Contact /><NotFound /></>);
    expect(screen.getByText('About Excalibur')).toBeInTheDocument();
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
  });
});
