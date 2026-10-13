export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 opacity-80" role="status">
      <span className="loading loading-spinner loading-lg text-primary" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div role="alert" className="alert alert-error my-8 max-w-xl mx-auto">
      <span>{error?.message || 'Something went wrong.'}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="text-center py-16 opacity-80">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {children}
    </div>
  );
}
