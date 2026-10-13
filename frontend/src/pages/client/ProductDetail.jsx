import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Globe, HandCoins, KeyRound, Monitor, ShoppingCart, XCircle } from 'lucide-react';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAddToCart } from '../../hooks/useAddToCart.js';
import { filterHistory, formatDate, initial, onImageError } from '../../lib/format.js';
import { ErrorState, Spinner } from '../../components/Feedback.jsx';
import PriceChart from '../../components/PriceChart.jsx';
import StarRating from '../../components/StarRating.jsx';

const ZOOMS = [['1m', '1m'], ['3m', '3m'], ['all', 'All']];

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const addToCart = useAddToCart();
  const { data: game, loading, error } = useApi(`/games/${id}`);
  const [zoom, setZoom] = useState('all');

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold">{error.status === 404 ? 'Game not found' : error.message}</h2>
        <Link to="/store" className="btn btn-primary mt-4">Back to Store</Link>
      </div>
    );
  }

  const features = [
    { icon: Globe, name: 'Global', desc: 'Can be activated in Thailand', color: 'text-success' },
    { icon: Monitor, name: game.platformName ?? 'PC', desc: `Activate/redeem on ${game.platformName ?? 'your platform'}`, color: 'text-warning' },
    { icon: KeyRound, name: 'Digital key', desc: 'Instant delivery', color: '' },
    { icon: HandCoins, name: 'Instant refunds', desc: 'Get an instant refund for unviewed keys', color: '' },
  ];
  const reviewLink = user ? `/review/${game.id}` : `/login?returnTo=${encodeURIComponent(`/review/${game.id}`)}`;
  const history = filterHistory(game.priceHistory, zoom);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <section className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-8">
        <img src={game.image} alt={game.name} onError={onImageError} className="w-full rounded-box shadow-2xl aspect-[3/4] object-cover" />
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold">{game.name}</h1>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, name, desc, color }) => (
              <div key={name} className="flex gap-3">
                <Icon size={30} className={`shrink-0 ${color}`} />
                <div>
                  <h3 className="font-bold">{name}</h3>
                  <p className="text-sm opacity-70">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-box border border-white/10 bg-white/5 p-6">
            <p className="text-4xl font-extrabold">${game.price.toFixed(2)}</p>
            {game.stock > 0 ? (
              <>
                <p className="text-success font-bold my-3 flex items-center gap-2">
                  <CheckCircle2 size={18} /> In Stock: {game.stock} keys available
                </p>
                <button type="button" className="btn btn-primary btn-lg w-full" onClick={() => addToCart(game.id)}>
                  <ShoppingCart size={20} /> Add to cart
                </button>
              </>
            ) : (
              <>
                <p className="text-error font-bold my-3 flex items-center gap-2">
                  <XCircle size={18} /> Out of Stock (Check back later)
                </p>
                <button type="button" className="btn btn-lg w-full" disabled>Out of Stock</button>
              </>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Price History</h2>
        <div className="bg-base-200 rounded-box p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold mr-2">zoom</span>
            {ZOOMS.map(([value, label]) => (
              <button key={value} type="button" className={`btn btn-xs ${zoom === value ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setZoom(value)}>
                {label}
              </button>
            ))}
          </div>
          <div className="h-72">
            <PriceChart history={history} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Product description</h2>
        <div className="bg-base-200 rounded-box p-6">
          <h3 className="text-xl font-bold mb-3">About {game.name}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {[game.platformName, 'Action', 'Digital'].filter(Boolean).map((tag) => (
              <span key={tag} className="badge badge-outline">{tag}</span>
            ))}
          </div>
          <p className="whitespace-pre-line leading-relaxed opacity-90">{game.description}</p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <Link to={reviewLink} className="btn btn-outline btn-primary rounded-full">Write a review</Link>
        </div>
        <div className="bg-base-200 rounded-box p-6 divide-y divide-white/10">
          {game.reviews.length === 0 && <p className="text-center opacity-60 py-6">No reviews yet.</p>}
          {game.reviews.map((r) => (
            <div key={r.id} className="py-4">
              <div className="flex flex-wrap items-center gap-3">
                <StarRating value={r.rating} />
                <div className="avatar avatar-placeholder">
                  <div className="bg-neutral w-8 rounded-full"><span className="text-sm font-bold">{initial(r.username)}</span></div>
                </div>
                <span className="font-bold">{r.username}</span>
                <span className="opacity-60 text-sm">{formatDate(r.date)}</span>
              </div>
              {r.comment && <p className="mt-2">{r.comment}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
