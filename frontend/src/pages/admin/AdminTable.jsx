import { useState } from 'react';
import { Search } from 'lucide-react';
import { toQuery } from '../../api/client.js';
import { useApi } from '../../hooks/useApi.js';
import Pagination from '../../components/Pagination.jsx';
import { ErrorState } from '../../components/Feedback.jsx';

/**
 * Searchable, paginated table backed by an admin list endpoint
 * (replaces adminTableLayout.ejs + tableSearch.js).
 * `children(reload)` can render extra toolbar buttons; columns use { key, label, render }.
 */
export default function AdminTable({ title, endpoint, columns, searchPlaceholder, filters = {}, toolbar, rowKey, version = 0 }) {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const filterKey = JSON.stringify(filters);
  const path = `${endpoint}${toQuery({ ...filters, search, page, v: version || undefined })}`;
  const { data, loading, error, reload } = useApi(path);

  // Reset to page 1 when filters change.
  const [lastFilters, setLastFilters] = useState(filterKey);
  if (lastFilters !== filterKey) {
    setLastFilters(filterKey);
    setPage(1);
  }

  const submit = (e) => {
    e.preventDefault();
    setSearch(input.trim());
    setPage(1);
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {toolbar}
      </div>
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={submit} className="flex gap-2 max-w-md" role="search">
            <label className="input input-sm w-full">
              <Search size={16} className="opacity-60" />
              <input type="search" aria-label={searchPlaceholder} placeholder={searchPlaceholder} value={input} onChange={(e) => setInput(e.target.value)} />
            </label>
            <button type="submit" className="btn btn-sm btn-primary">Search</button>
          </form>

          {error && <ErrorState error={error} onRetry={reload} />}
          <div className="overflow-x-auto mt-2">
            <table className="table table-zebra">
              <thead>
                <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={columns.length} className="text-center py-8"><span className="loading loading-spinner" /></td></tr>
                )}
                {!loading && data?.items.length === 0 && (
                  <tr><td colSpan={columns.length} className="text-center py-8 opacity-60">No results found.</td></tr>
                )}
                {!loading && data?.items.map((row) => (
                  <tr key={row[rowKey]}>
                    {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && (
            <div className="flex flex-wrap items-center justify-between text-sm opacity-80">
              <span>{data.totalItems} total</span>
              <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
