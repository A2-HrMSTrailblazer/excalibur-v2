import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { RequireAdmin, RequireUser } from './components/RouteGuards.jsx';
import ClientLayout from './components/ClientLayout.jsx';
import Home from './pages/client/Home.jsx';
import Store from './pages/client/Store.jsx';
import ProductDetail from './pages/client/ProductDetail.jsx';
import Cart from './pages/client/Cart.jsx';
import Checkout from './pages/client/Checkout.jsx';
import Orders from './pages/client/Orders.jsx';
import Profile from './pages/client/Profile.jsx';
import Review from './pages/client/Review.jsx';
import Login from './pages/client/Login.jsx';
import Register from './pages/client/Register.jsx';
import { About, Contact, NotFound } from './pages/client/StaticPages.jsx';
import { Spinner } from './components/Feedback.jsx';

// The back office is loaded only when an admin opens it, keeping the store bundle small.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const Products = lazy(() => import('./pages/admin/Products.jsx'));
const Categories = lazy(() => import('./pages/admin/Categories.jsx'));
const GameKeys = lazy(() => import('./pages/admin/GameKeys.jsx'));
const UsersPage = lazy(() => import('./pages/admin/ListPages.jsx').then((m) => ({ default: m.UsersPage })));
const OrdersPage = lazy(() => import('./pages/admin/ListPages.jsx').then((m) => ({ default: m.OrdersPage })));
const PaymentsPage = lazy(() => import('./pages/admin/ListPages.jsx').then((m) => ({ default: m.PaymentsPage })));
const ReviewsPage = lazy(() => import('./pages/admin/ListPages.jsx').then((m) => ({ default: m.ReviewsPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={<Spinner />}>
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="store" element={<Store />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<RequireUser><Cart /></RequireUser>} />
        <Route path="checkout" element={<RequireUser><Checkout /></RequireUser>} />
        <Route path="orders" element={<RequireUser><Orders /></RequireUser>} />
        <Route path="profile" element={<RequireUser><Profile /></RequireUser>} />
        <Route path="review/:id" element={<RequireUser><Review /></RequireUser>} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="game-keys" element={<GameKeys />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
      </Route>
    </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
