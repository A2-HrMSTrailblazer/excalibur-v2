import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { onImageError } from '../lib/format.js';
import { useAddToCart } from '../hooks/useAddToCart.js';

export default function ProductCard({ product }) {
  const addToCart = useAddToCart();
  const inStock = product.stock > 0;

  return (
    <article className="card bg-base-300 shadow-xl overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl">
      <Link to={`/product/${product.id}`} className="relative block aspect-[3/4] bg-base-200">
        <img src={product.image} alt={product.name} onError={onImageError} className="w-full h-full object-cover" loading="lazy" />
        {product.platformName && (
          <span className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-black/70 px-3 py-1.5 text-xs font-semibold">
            {product.platformIcon && (
              <img src={product.platformIcon} alt="" className="h-4 w-4 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            )}
            {product.platformName}
          </span>
        )}
      </Link>

      <div className="card-body p-4 gap-1">
        <Link to={`/product/${product.id}`} className="font-bold leading-tight line-clamp-2 min-h-[2.5rem] hover:text-primary">
          {product.name}
        </Link>
        <span className="text-success text-xs font-bold">{product.region || 'GLOBAL'}</span>
        <div className="mt-1">
          <span className="text-xs opacity-70">From </span>
          <span className="text-base 2xl:text-lg font-extrabold">{Number(product.price).toFixed(2)} USD</span>
        </div>

        {inStock ? (
          <p className="text-success text-xs font-bold flex items-center gap-1">
            <CheckCircle2 size={14} /> In Stock: {product.stock}
          </p>
        ) : (
          <p className="text-error text-xs font-bold flex items-center gap-1">
            <XCircle size={14} /> Out of Stock
          </p>
        )}

        <div className="card-actions flex-col gap-2 mt-1">
          <button
            type="button"
            className="btn btn-primary btn-sm w-full"
            disabled={!inStock}
            onClick={() => addToCart(product.id)}
          >
            {inStock ? 'Add to cart' : 'Out of Stock'}
          </button>
          <Link to={`/product/${product.id}`} className="btn btn-outline btn-sm w-full">
            Explore more
          </Link>
        </div>
      </div>
    </article>
  );
}
