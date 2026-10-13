import { Link } from 'react-router-dom';
import ProductCard from './ProductCard.jsx';

export default function ProductSection({ title, products = [], dark = false, showSeeAll = true }) {
  return (
    <section className={`py-10 ${dark ? 'bg-base-200' : ''}`}>
      <div className="px-4 lg:px-[10%]">
        <h2 className="text-2xl font-extrabold mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {showSeeAll && (
          <div className="text-center mt-6">
            <Link to="/store" className="btn btn-outline btn-primary rounded-full px-10">See All</Link>
          </div>
        )}
      </div>
    </section>
  );
}
