import { Star } from 'lucide-react';

/** Read-only stars, or clickable when onChange is given. */
export default function StarRating({ value, onChange, size = 18, label }) {
  return (
    <div className="flex gap-1" aria-label={label ?? `${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const star = (
          <Star size={size} className={filled ? 'fill-warning text-warning' : 'text-neutral-500'} />
        );
        return onChange ? (
          <button key={n} type="button" aria-label={`${label ?? 'Rating'} ${n}`} onClick={() => onChange(n)} className="cursor-pointer">
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
