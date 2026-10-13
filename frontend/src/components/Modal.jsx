import { X } from 'lucide-react';

/** Controlled DaisyUI modal. Renders nothing when closed. */
export default function Modal({ open, title, subtitle, onClose, children, actions, wide = false }) {
  if (!open) return null;
  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`modal-box ${wide ? 'max-w-3xl' : 'max-w-lg'} p-0 overflow-hidden`}>
        <div className="flex items-start justify-between gap-4 bg-secondary text-secondary-content px-6 py-4">
          <div>
            {subtitle && <p className="text-xs uppercase tracking-widest opacity-70">{subtitle}</p>}
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <button type="button" className="btn btn-ghost btn-sm btn-circle" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {actions && <div className="modal-action px-6 pb-5 mt-0">{actions}</div>}
      </div>
      <button type="button" className="modal-backdrop" aria-label="Close dialog" onClick={onClose} />
    </div>
  );
}
