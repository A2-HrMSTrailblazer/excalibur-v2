import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const EMPTY = { items: [], totalQty: 0, totalPrice: 0 };
const CartContext = createContext(null);

/** Keeps the cart (stored in the server session) available to the header and cart pages. */
export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  // Which user the cart was last loaded for. `loaded` stays false until the cart of the *current*
  // user has arrived, so pages like Checkout don't mistake "not loaded yet" for "empty".
  const [loadedFor, setLoadedFor] = useState(undefined);
  const userId = user?.id ?? null;
  const loaded = loadedFor === userId;

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(EMPTY);
      return EMPTY;
    }
    const data = await api('/cart');
    setCart(data);
    return data;
  }, [user]);

  useEffect(() => {
    refresh()
      .catch(() => setCart(EMPTY))
      .finally(() => setLoadedFor(userId));
  }, [refresh, userId]);

  const add = useCallback(async (gameId) => setCart(await api('/cart', { method: 'POST', body: { gameId } })), []);
  const change = useCallback(
    async (gameId, action) => setCart(await api(`/cart/${gameId}`, { method: 'PATCH', body: { action } })),
    [],
  );
  const remove = useCallback(async (gameId) => setCart(await api(`/cart/${gameId}`, { method: 'DELETE' })), []);

  const value = useMemo(() => ({ cart, loaded, refresh, add, change, remove, setCart }), [cart, loaded, refresh, add, change, remove]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
