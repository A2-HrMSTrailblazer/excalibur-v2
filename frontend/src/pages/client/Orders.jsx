import { Link } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { useApi } from '../../hooks/useApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime, money, onImageError } from '../../lib/format.js';
import ProfileSidebar from '../../components/ProfileSidebar.jsx';
import { EmptyState, ErrorState, Spinner } from '../../components/Feedback.jsx';

export default function Orders() {
  const { data: orders, loading, error, reload } = useApi('/orders');
  const { notify } = useToast();
  const copy = (key) => navigator.clipboard?.writeText(key).then(() => notify(`Copied: ${key}`, 'success'));

  return (
    <div className="px-4 lg:px-[10%] py-8 flex flex-col lg:flex-row gap-6">
      <ProfileSidebar />
      <section className="flex-1 bg-base-300 rounded-box p-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        {loading && <Spinner />}
        {error && <ErrorState error={error} onRetry={reload} />}
        {orders?.length === 0 && (
          <EmptyState title="No orders yet"><Link to="/store" className="btn btn-primary mt-3">Browse the store</Link></EmptyState>
        )}
        <div className="space-y-6">
          {(orders ?? []).map((order) => (
            <article key={order.orderId} className="bg-base-200 rounded-box p-5">
              <header className="flex flex-wrap justify-between gap-2 mb-4">
                <span className="font-bold">Order #{order.orderId}</span>
                <span className="opacity-70 text-sm">{formatDateTime(order.orderDate)}</span>
              </header>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.gameId} className="flex gap-4">
                    <img src={item.image} alt={item.name} onError={onImageError} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link to={`/product/${item.gameId}`} className="font-bold hover:text-primary">{item.name}</Link>
                        <span className="whitespace-nowrap">{item.quantity} × {money(item.price)}</span>
                      </div>
                      <p className="text-xs opacity-70 mb-2">{item.platformName}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.keys.map((key) => (
                          <button key={key} type="button" className="badge badge-lg badge-outline badge-accent font-mono gap-2" onClick={() => copy(key)} aria-label={`Copy key ${key}`}>
                            {key} <Copy size={12} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <footer className="text-right font-extrabold text-lg mt-4">Total: {money(order.total)}</footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
