import { useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { useApi } from '../../hooks/useApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatDate, money, onImageError } from '../../lib/format.js';
import Modal from '../../components/Modal.jsx';
import AdminTable from './AdminTable.jsx';
import InfoGrid from './InfoGrid.jsx';

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export function ProductForm({ product, categories, onSaved, onCancel }) {
  const { notify } = useToast();
  const [preview, setPreview] = useState(product?.imageUrl ?? null);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      if (product) await api(`/admin/products/${product.id}`, { method: 'PUT', form });
      else await api('/admin/products', { method: 'POST', form });
      notify(product ? 'Product updated.' : 'Product added.', 'success');
      onSaved();
    } catch (err) {
      notify(err.message, 'error');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3" aria-label="Product form">
      <fieldset className="fieldset">
        <label className="label" htmlFor="p-title">Product Name</label>
        <input id="p-title" name="title" className="input w-full" defaultValue={product?.name} required maxLength={150} />
        <label className="label" htmlFor="p-price">Price (USD)</label>
        <input id="p-price" name="price" type="number" step="0.01" min="0" className="input w-full" defaultValue={product?.price} required />
        <label className="label" htmlFor="p-date">Release Date</label>
        <input id="p-date" name="release_date" type="date" className="input w-full" defaultValue={toDateInput(product?.releaseDate)} />
        <label className="label" htmlFor="p-cat">Category</label>
        <select id="p-cat" name="category_id" className="select w-full" defaultValue={product?.categoryId ?? ''} required>
          <option value="" disabled>Choose a platform</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="label" htmlFor="p-desc">Description</label>
        <textarea id="p-desc" name="description" className="textarea w-full h-28" defaultValue={product?.description ?? ''} />
        <label className="label" htmlFor="p-image">{product ? 'Upload New Image' : 'Image'}</label>
        {preview && <img src={preview} alt="Preview" onError={onImageError} className="w-28 h-28 object-cover rounded-lg" />}
        <input id="p-image" name="image" type="file" accept="image/*" className="file-input w-full"
          onChange={(e) => e.target.files?.[0] && setPreview(URL.createObjectURL(e.target.files[0]))} />
      </fieldset>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>Save Product</button>
      </div>
    </form>
  );
}

export default function Products() {
  const { notify } = useToast();
  const { data: categories } = useApi('/categories');
  const [version, setVersion] = useState(0);
  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit' | 'view', product }
  const close = () => setModal(null);
  const saved = () => { close(); setVersion((v) => v + 1); };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await api(`/admin/products/${p.id}`, { method: 'DELETE' });
      notify('Product deleted.', 'success');
      setVersion((v) => v + 1);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'image', label: 'Image', render: (p) => <img src={p.imageUrl} alt="" onError={onImageError} className="w-12 h-12 rounded object-cover" /> },
    { key: 'name', label: 'Name', render: (p) => <span className="font-semibold">{p.name}</span> },
    { key: 'categoryName', label: 'Category', render: (p) => p.categoryName ?? <span className="opacity-50">None</span> },
    { key: 'price', label: 'Price', render: (p) => money(p.price) },
    { key: 'stock', label: 'Stock', render: (p) => <span className={`badge ${p.stock > 0 ? "badge-success" : "badge-error"} min-w-8`}>{p.stock}</span> },
    { key: 'releaseDate', label: 'Release', render: (p) => formatDate(p.releaseDate) },
    {
      key: 'ops', label: 'Operation', render: (p) => (
        <div className="flex gap-1">
          <button type="button" className="btn btn-xs btn-outline btn-primary" aria-label={`View ${p.name}`} onClick={() => setModal({ mode: 'view', product: p })}><Eye size={14} /></button>
          <button type="button" className="btn btn-xs btn-outline btn-warning" aria-label={`Edit ${p.name}`} onClick={() => setModal({ mode: 'edit', product: p })}><Pencil size={14} /></button>
          <button type="button" className="btn btn-xs btn-outline btn-error" aria-label={`Delete ${p.name}`} onClick={() => remove(p)}><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTable title="Product List" endpoint="/admin/products" columns={columns} rowKey="id" version={version}
        searchPlaceholder="Search product name..."
        toolbar={<button type="button" className="btn btn-primary btn-sm" onClick={() => setModal({ mode: 'add' })}><Plus size={16} /> Add Product</button>} />

      <Modal open={modal?.mode === 'add' || modal?.mode === 'edit'} title={modal?.mode === 'edit' ? 'Edit Product' : 'Add Product'} onClose={close} wide>
        {modal && modal.mode !== 'view' && <ProductForm product={modal.product} categories={categories ?? []} onSaved={saved} onCancel={close} />}
      </Modal>

      <Modal open={modal?.mode === 'view'} title={modal?.product?.name} subtitle="Product details" onClose={close} wide
        actions={<button type="button" className="btn" onClick={close}>Close</button>}>
        {modal?.mode === 'view' && (
          <div className="grid sm:grid-cols-[10rem_1fr] gap-5">
            <img src={modal.product.imageUrl} alt="" onError={onImageError} className="w-40 rounded-lg object-cover" />
            <div className="space-y-3">
              <InfoGrid items={[
                { label: 'Price', value: money(modal.product.price), highlight: true },
                { label: 'Category', value: modal.product.categoryName },
                { label: 'Release date', value: formatDate(modal.product.releaseDate) },
                { label: 'Rating', value: `${modal.product.rating.toFixed(2)} / 5` },
                { label: 'Keys in stock', value: modal.product.stock },
              ]} />
              <p className="whitespace-pre-line text-sm opacity-80">{modal.product.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
