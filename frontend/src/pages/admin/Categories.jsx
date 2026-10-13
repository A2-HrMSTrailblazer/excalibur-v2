import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../../api/client.js';
import { useToast } from '../../context/ToastContext.jsx';
import Modal from '../../components/Modal.jsx';
import AdminTable from './AdminTable.jsx';

export default function Categories() {
  const { notify } = useToast();
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState(null); // null = closed, {} = add, {id,...} = edit
  const refresh = () => setVersion((v) => v + 1);

  const save = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (editing.id) await api(`/admin/categories/${editing.id}`, { method: 'PUT', body });
      else await api('/admin/categories', { method: 'POST', body });
      notify('Category saved.', 'success');
      setEditing(null);
      refresh();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const remove = async (c) => {
    const warning = c.gameCount > 0 ? ` ${c.gameCount} games will be left without a platform.` : '';
    if (!window.confirm(`Delete category "${c.name}"?${warning}`)) return;
    try {
      await api(`/admin/categories/${c.id}`, { method: 'DELETE' });
      notify('Category deleted.', 'success');
      refresh();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'icon', label: 'Icon', render: (c) => <img src={`/asset/client/icon/${c.icon}.png`} alt="" className="h-6 w-6 object-contain" onError={(e) => { e.currentTarget.replaceWith(document.createTextNode(c.icon)); }} /> },
    { key: 'name', label: 'Name', render: (c) => <span className="font-semibold">{c.name}</span> },
    { key: 'gameCount', label: 'Games' },
    {
      key: 'ops', label: 'Operation', render: (c) => (
        <div className="flex gap-1">
          <button type="button" className="btn btn-xs btn-outline btn-warning" aria-label={`Edit ${c.name}`} onClick={() => setEditing(c)}><Pencil size={14} /></button>
          <button type="button" className="btn btn-xs btn-outline btn-error" aria-label={`Delete ${c.name}`} onClick={() => remove(c)}><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTable title="Categories" endpoint="/admin/categories" columns={columns} rowKey="id" version={version}
        searchPlaceholder="Search category..."
        toolbar={<button type="button" className="btn btn-primary btn-sm" onClick={() => setEditing({})}><Plus size={16} /> Add Category</button>} />
      <Modal open={Boolean(editing)} title={editing?.id ? 'Edit Category' : 'Add Category'} onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={save} className="fieldset">
            <label className="label" htmlFor="c-name">Name</label>
            <input id="c-name" name="name" className="input w-full" defaultValue={editing.name} required maxLength={100} />
            <label className="label" htmlFor="c-icon">Icon file name (in /asset/client/icon, without .png)</label>
            <input id="c-icon" name="icon" className="input w-full" defaultValue={editing.icon ?? 'Steam-Logo'} maxLength={100} />
            <div className="flex justify-end gap-2 pt-4">
              <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
