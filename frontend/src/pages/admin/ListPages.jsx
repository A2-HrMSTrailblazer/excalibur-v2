import { useState } from 'react';
import { Eye } from 'lucide-react';
import { formatDate, formatDateTime, initial, money, ORDER_STATUS_BADGE, PAYMENT_TYPE_BADGE } from '../../lib/format.js';
import Modal from '../../components/Modal.jsx';
import StarRating from '../../components/StarRating.jsx';
import AdminTable from './AdminTable.jsx';
import InfoGrid from './InfoGrid.jsx';

const ViewButton = ({ label, onClick }) => (
  <button type="button" className="btn btn-xs btn-outline btn-primary" aria-label={label} onClick={onClick}><Eye size={14} /></button>
);

function useViewer() {
  const [item, setItem] = useState(null);
  return { item, open: setItem, close: () => setItem(null) };
}

const closeButton = (close) => <button type="button" className="btn" onClick={close}>Close</button>;

export function UsersPage() {
  const view = useViewer();
  const columns = [
    { key: 'userID', label: 'ID' },
    { key: 'username', label: 'Username', render: (u) => <span className="font-semibold">{u.username}</span> },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (u) => <span className={`badge badge-sm ${u.role === 'admin' ? 'badge-accent' : 'badge-ghost'}`}>{u.role}</span> },
    { key: 'registerDate', label: 'Registered', render: (u) => formatDate(u.registerDate) },
    { key: 'totalOrders', label: 'Orders' },
    { key: 'totalSpending', label: 'Total spent', render: (u) => money(u.totalSpending) },
    { key: 'ops', label: 'Operation', render: (u) => <ViewButton label={`View ${u.username}`} onClick={() => view.open(u)} /> },
  ];
  return (
    <>
      <AdminTable title="User List" endpoint="/admin/users" columns={columns} rowKey="userID" searchPlaceholder="Search username or email..." />
      <Modal open={Boolean(view.item)} title={`#${view.item?.userID}`} subtitle="User details" onClose={view.close} actions={closeButton(view.close)}>
        {view.item && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="avatar avatar-placeholder"><div className="bg-neutral text-neutral-content w-14 rounded-full"><span className="text-xl">{initial(view.item.username)}</span></div></div>
              <div><p className="font-bold text-lg">{view.item.username}</p><p className="opacity-70">{view.item.email}</p></div>
            </div>
            <InfoGrid items={[
              { label: 'Register date', value: formatDate(view.item.registerDate) },
              { label: 'Total orders', value: view.item.totalOrders },
              { label: 'Role', value: view.item.role },
              { label: 'Total spending', value: money(view.item.totalSpending), highlight: true },
            ]} />
          </div>
        )}
      </Modal>
    </>
  );
}

export function OrdersPage() {
  const view = useViewer();
  const columns = [
    { key: 'orderID', label: 'Order ID' },
    { key: 'username', label: 'Username' },
    { key: 'items', label: 'Items', render: (o) => o.items.length },
    { key: 'totalAmount', label: 'Total Price', render: (o) => money(o.totalAmount) },
    { key: 'paymentMethod', label: 'Payment' },
    { key: 'status', label: 'Status', render: (o) => <span className={`badge badge-sm ${ORDER_STATUS_BADGE[o.status] ?? ''}`}>{o.status}</span> },
    { key: 'orderDate', label: 'Date', render: (o) => formatDateTime(o.orderDate) },
    { key: 'ops', label: 'Operation', render: (o) => <ViewButton label={`View order ${o.orderID}`} onClick={() => view.open(o)} /> },
  ];
  return (
    <>
      <AdminTable title="Order List" endpoint="/admin/orders" columns={columns} rowKey="orderID" searchPlaceholder="Search order, username, or product..." />
      <Modal open={Boolean(view.item)} title={`#${view.item?.orderID}`} subtitle="Order details" onClose={view.close} wide actions={closeButton(view.close)}>
        {view.item && (
          <div className="space-y-4">
            <div className={`badge badge-lg ${ORDER_STATUS_BADGE[view.item.status] ?? ''}`}>{view.item.status}</div>
            <InfoGrid items={[
              { label: 'Customer', value: view.item.username },
              { label: 'Payment method', value: view.item.paymentMethod },
              { label: 'Order date', value: formatDateTime(view.item.orderDate) },
              { label: 'Total amount', value: money(view.item.totalAmount), highlight: true },
            ]} />
            <div className="divider text-xs">ITEMS IN THIS ORDER</div>
            <ul className="space-y-2">
              {view.item.items.map((i) => (
                <li key={i.keyCode} className="flex justify-between bg-base-200 rounded-lg px-3 py-2">
                  <span><b>{i.productName}</b> <span className="font-mono text-xs opacity-70 ml-2">{i.keyCode}</span></span>
                  <span>{money(i.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </>
  );
}

const PAYMENT_FILTERS = [['', 'All'], ['deposit', 'Deposit'], ['purchase', 'Purchase'], ['refund', 'Refund']];

export function PaymentsPage() {
  const view = useViewer();
  const [type, setType] = useState('');
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'orderID', label: 'Order', render: (p) => p.orderID ?? '—' },
    { key: 'username', label: 'User' },
    { key: 'amount', label: 'Amount', render: (p) => money(p.amount) },
    { key: 'type', label: 'Type', render: (p) => <span className={`badge badge-sm ${PAYMENT_TYPE_BADGE[p.type]}`}>{p.type}</span> },
    { key: 'status', label: 'Status' },
    { key: 'ops', label: 'Operation', render: (p) => <ViewButton label={`View payment ${p.id}`} onClick={() => view.open(p)} /> },
  ];
  const filters = (
    <div className="join" role="group" aria-label="Filter by type">
      {PAYMENT_FILTERS.map(([value, label]) => (
        <button key={label} type="button" className={`join-item btn btn-sm ${type === value ? 'btn-primary' : ''}`} onClick={() => setType(value)}>{label}</button>
      ))}
    </div>
  );
  return (
    <>
      <AdminTable title="Payment List" endpoint="/admin/payments" columns={columns} rowKey="id" filters={{ type }} toolbar={filters}
        searchPlaceholder="Search payment, order, or user..." />
      <Modal open={Boolean(view.item)} title={`#${view.item?.id}`} subtitle="Payment details" onClose={view.close} actions={closeButton(view.close)}>
        {view.item && (
          <InfoGrid items={[
            { label: 'User', value: view.item.username },
            { label: 'Order', value: view.item.orderID ?? '—' },
            { label: 'Type', value: view.item.type },
            { label: 'Status', value: view.item.status },
            { label: 'Recorded', value: formatDateTime(view.item.date) },
            { label: 'Amount', value: money(view.item.amount), highlight: true },
          ]} />
        )}
      </Modal>
    </>
  );
}

export function ReviewsPage() {
  const view = useViewer();
  const columns = [
    { key: 'reviewID', label: 'ID' },
    { key: 'username', label: 'User' },
    { key: 'productName', label: 'Product' },
    { key: 'rating', label: 'Rating', render: (r) => <StarRating value={r.rating} size={14} /> },
    { key: 'comment', label: 'Comment', render: (r) => <span className="line-clamp-1 max-w-xs">{r.comment}</span> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'ops', label: 'Operation', render: (r) => <ViewButton label={`View review ${r.reviewID}`} onClick={() => view.open(r)} /> },
  ];
  return (
    <>
      <AdminTable title="Review List" endpoint="/admin/reviews" columns={columns} rowKey="reviewID" searchPlaceholder="Search user, product or comment..." />
      <Modal open={Boolean(view.item)} title={view.item?.productName} subtitle="Review details" onClose={view.close} actions={closeButton(view.close)}>
        {view.item && (
          <div className="space-y-4">
            <div className="flex items-center gap-3"><StarRating value={view.item.rating} /><b>{view.item.username}</b><span className="opacity-60 text-sm">{formatDate(view.item.date)}</span></div>
            <p className="bg-base-200 rounded-box p-4 whitespace-pre-line">{view.item.comment}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
