import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);
let nextToastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = 'info') => {
    nextToastId += 1;
    const id = nextToastId;
    setToasts((list) => [...list, { id, message, type }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3500);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);
  const alertClass = { success: 'alert-success', error: 'alert-error', info: 'alert-info' };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast toast-end toast-bottom z-[100]">
        {toasts.map((t) => (
          <div key={t.id} role="status" className={`alert ${alertClass[t.type] ?? 'alert-info'} shadow-lg`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
