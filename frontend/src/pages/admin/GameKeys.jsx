import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { useApi } from '../../hooks/useApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDateTime } from '../../lib/format.js';
import Modal from '../../components/Modal.jsx';
import AdminTable from './AdminTable.jsx';

const STATUS_BADGE = { available: 'badge-success', sold: 'badge-neutral', reserved: 'badge-warning' };

export default function GameKeys() {
  const { notify } = useToast();
  const [version, setVersion] = useState(0);
  const [adding, setAdding] = useState(false);
  const { data: products } = useApi(adding ? '/admin/products/options' : null);

  const add = async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api('/admin/keys', { method: 'POST', body: { key_code: form.key_code, game_id: Number(form.game_id) } });
      notify('Key added.', 'success');
      setAdding(false);
      setVersion((v) => v + 1);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const remove = async (k) => {
    if (!window.confirm(`Delete key ${k.code}?`)) return;
    try {
      await api(`/admin/keys/${k.id}`, { method: 'DELETE' });
      notify('Key deleted.', 'success');
      setVersion((v) => v + 1);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'code', label: 'Key Code', render: (k) => <span className="font-mono">{k.code}</span> },
    { key: 'productName', label: 'Product' },
    { key: 'category', label: 'Platform', render: (k) => k.category ?? '—' },
    { key: 'status', label: 'Status', render: (k) => <span className={`badge badge-sm ${STATUS_BADGE[k.status]}`}>{k.status}</span> },
    { key: 'date', label: 'Sold on', render: (k) => formatDateTime(k.date) },
    {
      key: 'ops', label: 'Operation', render: (k) => (
        <button type="button" className="btn btn-xs btn-outline btn-error" aria-label={`Delete key ${k.code}`}
          disabled={k.status === 'sold'} title={k.status === 'sold' ? 'Sold keys cannot be deleted' : undefined} onClick={() => remove(k)}>
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminTable title="Game Keys" endpoint="/admin/keys" columns={columns} rowKey="id" version={version}
        searchPlaceholder="Search key, product or platform..."
        toolbar={<button type="button" className="btn btn-primary btn-sm" onClick={() => setAdding(true)}><Plus size={16} /> Add Key</button>} />
      <Modal open={adding} title="Add Game Key" onClose={() => setAdding(false)}>
        <form onSubmit={add} className="fieldset">
          <label className="label" htmlFor="k-code">Game Key Code</label>
          <input id="k-code" name="key_code" className="input w-full font-mono" required maxLength={100} />
          <label className="label" htmlFor="k-game">Product</label>
          <select id="k-game" name="game_id" className="select w-full" required defaultValue="">
            <option value="" disabled>Choose a product</option>
            {(products ?? []).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <p className="text-xs opacity-60">The platform comes from the product's category.</p>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="btn" onClick={() => setAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Key</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
