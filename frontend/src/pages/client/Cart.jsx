import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useApi } from '../../hooks/useApi.js';
import { money, onImageError } from '../../lib/format.js';
import ProductSection from '../../components/ProductSection.jsx';
import { EmptyState } from '../../components/Feedback.jsx';

export function CartLine({ item, onChange, onRemove }) {
  return (
    <div className="flex gap-4 bg-base-300 rounded-box p-4">
      <img src={item.image} alt={item.name} onError={onImageError} className="w-24 h-24 rounded-lg object-cover" />
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between gap-3">
          <div>
            <Link to={`/product/${item.gameId}`} className="font-bold hover:text-primary">{item.name}</Link>
            <p className="text-xs opacity-70">{item.platformName} · {item.stock} keys left</p>
          </div>
          <button type="button" className="btn btn-ghost btn-sm btn-circle" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.gameId)}>
            <Trash2 size={18} />
          </button>
        </div>
        <div className="flex items-end justify-between">
          <div className="join">
            <button type="button" className="join-item btn btn-sm" aria-label={`Decrease ${item.name}`} disabled={item.quantity <= 1} onClick={() => onChange(item.gameId, 'decrease')}>
              <Minus size={14} />
            </button>
            <span className="join-item btn btn-sm pointer-events-none" aria-label="Quantity">{item.quantity}</span>
            <button type="button" className="join-item btn btn-sm" aria-label={`Increase ${item.name}`} disabled={item.quantity >= item.stock} onClick={() => onChange(item.gameId, 'increase')}>
              <Plus size={14} />
            </button>
          </div>
          <span className="font-bold text-lg">{money(item.price)}</span>
        </div>
      </div>
    </div>
  );
}

export function useCartActions() {
  const { change, remove } = useCart();
  const { notify } = useToast();
  const wrap = (fn) => async (...args) => {
    try {
      await fn(...args);
    } catch (err) {
      notify(err.message, 'error');
    }
  };
  return { onChange: wrap(change), onRemove: wrap(remove) };
}

export default function Cart() {
  const { cart } = useCart();
  const actions = useCartActions();
  const navigate = useNavigate();
  const { data: related } = useApi('/games/random?limit=5');

  return (
    <>
      <div className="px-4 lg:px-[10%] py-8">
        <h1 className="text-3xl font-extrabold mb-6">Cart</h1>
        {cart.items.length === 0 ? (
          <EmptyState title="Your cart is empty">
            <Link to="/store" className="btn btn-primary mt-3">Go shopping</Link>
          </EmptyState>
        ) : (
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
            <div className="space-y-4">
              {cart.items.map((item) => <CartLine key={item.gameId} item={item} {...actions} />)}
            </div>
            <aside className="bg-base-300 rounded-box p-6 h-fit lg:sticky lg:top-32 space-y-4">
              <h2 className="text-xl font-bold">Summary</h2>
              <div className="flex justify-between"><span>Items</span><span>{cart.totalQty}</span></div>
              <div className="flex justify-between text-2xl font-extrabold"><span>Total:</span><span>{money(cart.totalPrice)}</span></div>
              <button type="button" className="btn btn-primary btn-lg w-full" onClick={() => navigate('/checkout')}>Checkout</button>
            </aside>
          </div>
        )}
      </div>
      {related && <ProductSection title="You may also like" products={related} dark showSeeAll={false} />}
    </>
  );
}
