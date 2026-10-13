import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

/** Adds a game to the cart, or sends guests to the login page first (same as SE262). */
export function useAddToCart() {
  const { user } = useAuth();
  const { add } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(async (gameId) => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    try {
      await add(gameId);
      navigate('/cart');
    } catch (err) {
      notify(err.message, 'error');
    }
  }, [user, add, notify, navigate, location]);
}
