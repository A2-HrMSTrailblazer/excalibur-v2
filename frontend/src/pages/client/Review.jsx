import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useApi } from '../../hooks/useApi.js';
import { MIN_REVIEW_LENGTH, onImageError, overallRating } from '../../lib/format.js';
import StarRating from '../../components/StarRating.jsx';
import ProductSection from '../../components/ProductSection.jsx';
import { ErrorState, Spinner } from '../../components/Feedback.jsx';

const CATEGORIES = ['Gameplay', 'Story', 'Graphics', 'Soundtrack'];

export default function Review() {
  const { id } = useParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const { data: game, loading, error } = useApi(`/games/${id}`);
  const { data: related } = useApi(`/games/random?exclude=${id}&limit=5`);
  const [scores, setScores] = useState(Object.fromEntries(CATEGORIES.map((c) => [c, 5])));
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading) return <Spinner />;
  if (error) return <ErrorState error={error} />;

  const overall = overallRating(scores);
  const remaining = MIN_REVIEW_LENGTH - comment.trim().length;

  const submit = async (e) => {
    e.preventDefault();
    if (remaining > 0) return;
    setSaving(true);
    try {
      await api(`/games/${id}/reviews`, { method: 'POST', body: { rating: overall, comment } });
      notify('Thanks for your review!', 'success');
      navigate(`/product/${id}`);
    } catch (err) {
      notify(err.message, 'error');
      setSaving(false);
    }
  };

  return (
    <>
      <div className="px-4 lg:px-[10%] py-8 grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
        <form onSubmit={submit} className="bg-base-300 rounded-box p-6 grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Detailed rating</h2>
            <div className="opacity-90">
              <p className="text-sm mb-1">Overall rating</p>
              <StarRating value={overall} label="Overall rating" size={22} />
            </div>
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <p className="text-sm mb-1">{cat}</p>
                <StarRating value={scores[cat]} label={cat} size={22} onChange={(v) => setScores({ ...scores, [cat]: v })} />
              </div>
            ))}
            <div>
              <label htmlFor="nickname" className="text-sm block mb-1">Nickname</label>
              <input id="nickname" className="input w-full" value={user.username} readOnly />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-1">Review</h2>
            <p className="text-sm opacity-60 mb-3">Your review must contain at least {MIN_REVIEW_LENGTH} characters.</p>
            <textarea aria-label="Review text" className="textarea w-full flex-1 min-h-56" placeholder="Write your experience here..."
              value={comment} onChange={(e) => setComment(e.target.value)} />
            <p className={`text-xs mt-1 ${remaining > 0 ? 'text-warning' : 'text-success'}`}>
              {remaining > 0 ? `${remaining} more characters needed` : 'Looks good!'}
            </p>
            <div className="text-right mt-4">
              <button type="submit" className="btn btn-primary px-10" disabled={remaining > 0 || saving}>Confirm</button>
            </div>
          </div>
        </form>

        <aside className="card bg-base-300 overflow-hidden h-fit">
          <img src={game.image} alt={game.name} onError={onImageError} className="w-full aspect-[3/4] object-cover" />
          <div className="card-body">
            <h3 className="card-title">{game.name}</h3>
            <span className="text-success text-sm font-bold">{game.region}</span>
            <span className="text-sm opacity-60">From</span>
            <span className="text-2xl font-extrabold text-primary">{game.price.toFixed(2)} USD</span>
          </div>
        </aside>
      </div>
      {related && <ProductSection title="You may also like" products={related} dark showSeeAll={false} />}
    </>
  );
}
