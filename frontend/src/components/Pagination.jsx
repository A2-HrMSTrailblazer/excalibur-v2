/** Numbered pagination with a window of ±2 pages, like the old EJS partial. */
export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages = [];
  for (let p = start; p <= end; p += 1) pages.push(p);

  return (
    <nav className="join flex justify-center my-6" aria-label="Pagination">
      <button type="button" className="join-item btn btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        «
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? 'page' : undefined}
          className={`join-item btn btn-sm ${p === page ? 'btn-primary' : ''}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" className="join-item btn btn-sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        »
      </button>
    </nav>
  );
}
