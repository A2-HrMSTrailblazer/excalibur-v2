import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Gamepad2, KeyRound, ShoppingCart, Users, Wallet } from 'lucide-react';
import { useApi } from '../../hooks/useApi.js';
import { ErrorState, Spinner } from '../../components/Feedback.jsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function Dashboard() {
  const { data, loading, error, reload } = useApi('/admin/dashboard');
  if (loading) return <Spinner />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const { stats, salesData, topSelling } = data;
  const cards = [
    { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Wallet, color: 'text-primary' },
    { label: 'Total Orders', value: stats.orders.toLocaleString(), icon: ShoppingCart, color: 'text-success' },
    { label: 'Total Products', value: stats.products.toLocaleString(), icon: Gamepad2, color: 'text-info' },
    { label: 'Total Users', value: stats.users.toLocaleString(), icon: Users, color: 'text-warning' },
    { label: 'Keys Remaining', value: stats.keys.toLocaleString(), icon: KeyRound, color: 'text-error' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card bg-base-100 shadow-sm">
            <div className="card-body items-center text-center p-4">
              <span className="text-xs font-bold opacity-60">{label}</span>
              <Icon size={28} className={color} />
              <span className="text-xl font-extrabold">{value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-sm lg:col-span-2">
          <div className="card-body">
            <h2 className="font-bold mb-2">Sales Overview</h2>
            <div className="h-72">
              <Bar
                aria-label="Monthly revenue chart"
                role="img"
                data={{ labels: salesData.labels, datasets: [{ label: 'Monthly Revenue ($)', data: salesData.values, backgroundColor: '#4e73df', borderRadius: 5, barPercentage: 0.6 }] }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: (v) => `$${v}` } } } }}
              />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="font-bold mb-2">Top Selling by Product</h2>
            {topSelling.length === 0 && <p className="opacity-60">No sales yet.</p>}
            <ul className="space-y-3">
              {topSelling.map((item, i) => (
                <li key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-bold truncate ${i < 3 ? 'text-error' : ''}`}>{item.name}</span>
                    <span className="font-bold whitespace-nowrap">{item.count} Sold</span>
                  </div>
                  <progress className={`progress w-full ${i < 3 ? 'progress-warning' : 'progress-primary'}`} value={item.percentage} max="100" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
