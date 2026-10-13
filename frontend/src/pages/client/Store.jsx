import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { toQuery } from '../../api/client.js';
import { useApi } from '../../hooks/useApi.js';
import ProductCard from '../../components/ProductCard.jsx';
import Pagination from '../../components/Pagination.jsx';
import { EmptyState, ErrorState, Spinner } from '../../components/Feedback.jsx';

export default function Store() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const platforms = params.getAll('platform');
  const minPrice = params.get('minPrice') ?? '';
  const maxPrice = params.get('maxPrice') ?? '';
  const page = Number(params.get('page')) || 1;

  const { data: categories } = useApi('/categories');
  const { data, loading, error, reload } = useApi(`/games${toQuery({ search, platform: platforms, minPrice, maxPrice, page })}`);

  // Local form state for the filter panel; applied to the URL on submit.
  const [form, setForm] = useState({ minPrice, maxPrice, platforms });
  const [showFilters, setShowFilters] = useState(false);
  const paramsKey = params.toString();
  useEffect(() => {
    setForm({ minPrice, maxPrice, platforms });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  const apply = (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (search) next.set('search', search);
    form.platforms.forEach((p) => next.append('platform', p));
    if (form.minPrice !== '') next.set('minPrice', form.minPrice);
    if (form.maxPrice !== '') next.set('maxPrice', form.maxPrice);
    setParams(next);
    setShowFilters(false);
  };

  const clear = () => setParams(search ? { search } : {});

  const togglePlatform = (name) => setForm((f) => ({
    ...f,
    platforms: f.platforms.includes(name) ? f.platforms.filter((p) => p !== name) : [...f.platforms, name],
  }));

  const goToPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next);
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  let heading = 'All games';
  if (search) heading = `Results for “${search}”`;
  else if (platforms.length > 0) heading = platforms.join(', ');

  return (
    <div className="px-4 lg:px-[10%] py-6 flex flex-col lg:flex-row gap-6">
      <button type="button" className="btn btn-outline btn-sm lg:hidden self-start" onClick={() => setShowFilters((s) => !s)}>
        <SlidersHorizontal size={16} /> Filters
      </button>

      <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-60 shrink-0`}>
        <form onSubmit={apply} className="bg-base-200 rounded-box p-5 space-y-5 lg:sticky lg:top-32">
          <div>
            <h3 className="font-bold mb-3">Price range (USD)</h3>
            <div className="flex items-center gap-2">
              <input type="number" min="0" step="0.01" aria-label="Minimum price" placeholder="Min" className="input input-sm w-full"
                value={form.minPrice} onChange={(e) => setForm({ ...form, minPrice: e.target.value })} />
              <span>-</span>
              <input type="number" min="0" step="0.01" aria-label="Maximum price" placeholder="Max" className="input input-sm w-full"
                value={form.maxPrice} onChange={(e) => setForm({ ...form, maxPrice: e.target.value })} />
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-3">Platforms</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {(categories ?? []).map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="checkbox" className="checkbox checkbox-sm checkbox-primary"
                    checked={form.platforms.includes(cat.name)} onChange={() => togglePlatform(cat.name)} />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm flex-1">Apply</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>Clear</button>
          </div>
        </form>
      </aside>

      <section className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
          <h1 className="text-2xl font-extrabold">{heading}</h1>
          {data && <span className="opacity-70 text-sm">{data.total} games found</span>}
        </div>
        {loading && <Spinner />}
        {error && <ErrorState error={error} onRetry={reload} />}
        {data && data.items.length === 0 && (
          <EmptyState title="No games found">Try a different search or remove some filters.</EmptyState>
        )}
        {data && data.items.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {data.items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onChange={goToPage} />
          </>
        )}
      </section>
    </div>
  );
}
