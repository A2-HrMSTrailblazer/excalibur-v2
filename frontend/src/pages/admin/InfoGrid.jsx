/** Two-column label/value grid used by the "view" modals. */
export default function InfoGrid({ items }) {
  return (
    <dl className="grid sm:grid-cols-2 gap-3">
      {items.map(({ label, value, highlight }) => (
        <div key={label} className={`rounded-box p-3 ${highlight ? 'bg-primary/10 border border-primary/30' : 'bg-base-200'}`}>
          <dt className="text-xs uppercase tracking-wide opacity-60">{label}</dt>
          <dd className={`font-bold ${highlight ? 'text-primary text-lg' : ''}`}>{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
