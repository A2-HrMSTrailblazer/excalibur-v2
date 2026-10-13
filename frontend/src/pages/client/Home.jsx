import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi.js';
import ProductSection from '../../components/ProductSection.jsx';
import { ErrorState, Spinner } from '../../components/Feedback.jsx';

const BANNERS = [
  { to: '/store?platform=Xbox%20Live', img: '/asset/client/home/banner_games.jpg', alt: 'Games Promo', label: 'Xbox Live deals', grow: 'lg:flex-[3]' },
  { to: '/store?platform=Steam', img: '/asset/client/home/banner_steam.jpg', alt: 'Steam Sale', label: 'Steam Sale', grow: 'lg:flex-[1.2]' },
  { to: '/store?platform=Nintendo', img: '/asset/client/home/banner_mk.jpg', alt: 'Nintendo', label: 'Nintendo', grow: 'lg:flex-[1.2]' },
];

function Banner({ banner }) {
  return (
    <Link to={banner.to} className={`relative block h-32 sm:h-56 lg:h-80 overflow-hidden rounded-box bg-gradient-to-br from-secondary to-base-300 ${banner.grow}`}>
      <img src={banner.img} alt={banner.alt} className="w-full h-full object-cover transition hover:scale-105" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      <span className="absolute bottom-3 left-4 text-xl font-extrabold drop-shadow-lg">{banner.label}</span>
    </Link>
  );
}

export default function Home() {
  const { data, loading, error, reload } = useApi('/home');

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3 px-4 lg:px-[10%] pt-6">
        {BANNERS.map((b) => <Banner key={b.to} banner={b} />)}
      </div>
      {loading && <Spinner />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (
        <>
          <ProductSection title="Nintendo Game" products={data.nintendo} />
          <ProductSection title="Top games" products={data.topGames} dark />
          <ProductSection title="Recommended for you" products={data.recommended} />
        </>
      )}
    </>
  );
}
