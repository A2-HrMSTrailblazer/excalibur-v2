import { CategoryScale, Chart as ChartJS, Filler, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatDate } from '../lib/format.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function PriceChart({ history }) {
  const data = {
    labels: history.map((p) => formatDate(p.date)),
    datasets: [{
      label: 'Price (USD)',
      data: history.map((p) => p.price),
      borderColor: '#ffcc00',
      backgroundColor: 'rgba(255, 204, 0, 0.12)',
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#ffcc00',
      borderWidth: 2,
      fill: true,
      tension: 0.35,
    }],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` $${ctx.parsed.y.toFixed(2)}` } } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a0a4cc', callback: (v) => `$${v}` } },
      x: { grid: { display: false }, ticks: { color: '#a0a4cc' } },
    },
  };
  return <Line data={data} options={options} aria-label="Price history chart" role="img" />;
}
