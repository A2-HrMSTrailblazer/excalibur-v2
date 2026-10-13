import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Bot, Clock, Copy, TriangleAlert } from 'lucide-react';
import { api } from '../../api/client.js';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useApi } from '../../hooks/useApi.js';
import { money } from '../../lib/format.js';
import Modal from '../../components/Modal.jsx';
import { Spinner } from '../../components/Feedback.jsx';
import { CartLine, useCartActions } from './Cart.jsx';

export const PROMPTPAY_ID = '0855980368';
export const TRUEMONEY_NUMBER = '096-174-8554';
const PAY_WINDOW_SECONDS = 15 * 60;

export const formatCountdown = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

function useCountdown(running) {
  const [left, setLeft] = useState(PAY_WINDOW_SECONDS);
  useEffect(() => {
    if (!running) return undefined;
    setLeft(PAY_WINDOW_SECONDS);
    const timer = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);
  return left;
}

function copy(text, notify) {
  navigator.clipboard?.writeText(text).then(() => notify(`Copied: ${text}`, 'success'));
}

export default function Checkout() {
  const { cart, loaded, refresh } = useCart();
  const actions = useCartActions();
  const { notify } = useToast();
  const navigate = useNavigate();
  const { data: methods } = useApi('/checkout/payment-methods');
  const [method, setMethod] = useState('QR');
  const [modalOpen, setModalOpen] = useState(false);
  const [ref, setRef] = useState('');
  const [paying, setPaying] = useState(false);
  const secondsLeft = useCountdown(modalOpen);
  const expired = modalOpen && secondsLeft === 0;

  if (!loaded) return <Spinner />;
  if (cart.items.length === 0 && !paying) return <Navigate to="/cart" replace />;

  const open = () => {
    setRef(String(Math.floor(100000 + Math.random() * 900000)));
    setModalOpen(true);
  };

  const confirm = async () => {
    setPaying(true);
    try {
      // Simulated bank verification delay, like the SE262 "auto-verify bot".
      await new Promise((r) => setTimeout(r, import.meta.env.MODE === 'test' ? 0 : 2000));
      await api('/checkout', { method: 'POST', body: { paymentMethod: method } });
      await refresh();
      notify('Payment received. Your keys are ready!', 'success');
      navigate('/orders');
    } catch (err) {
      notify(err.message, 'error');
      setPaying(false);
      setModalOpen(false);
    }
  };

  const total = cart.totalPrice.toFixed(2);

  return (
    <div className="px-4 lg:px-[10%] py-8 grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
      <section className="order-2 lg:order-1">
        <h1 className="text-3xl font-extrabold mb-6">Payment method</h1>
        <div className="space-y-4">
          {(methods ?? []).map((m) => (
            <label key={m.id} className={`flex items-center justify-between gap-4 rounded-box border-2 p-5 cursor-pointer ${method === m.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-base-300'}`}>
              <div className="flex items-center gap-4">
                <img src={m.logo} alt="" className="h-12 w-20 object-contain bg-white rounded-lg p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span className="text-xl font-bold">{m.name}</span>
              </div>
              <input type="radio" name="payment_method" className="radio radio-primary" value={m.id}
                checked={method === m.id} onChange={() => setMethod(m.id)} aria-label={m.name} />
            </label>
          ))}
        </div>
      </section>

      <aside className="order-1 lg:order-2 bg-base-300 rounded-box p-6 h-fit lg:sticky lg:top-32 space-y-4">
        <h2 className="text-xl font-bold">Your order</h2>
        <div className="space-y-3">
          {cart.items.map((item) => <CartLine key={item.gameId} item={item} {...actions} />)}
        </div>
        <div className="border-t-2 border-white pt-4 flex justify-between text-2xl font-extrabold">
          <span>Total:</span><span>{money(cart.totalPrice)}</span>
        </div>
        <button type="button" className="btn btn-primary btn-lg w-full" onClick={open}>Continue</button>
      </aside>

      <Modal open={modalOpen} title="Complete Payment" subtitle={`Ref: EX-${ref}`} onClose={() => !paying && setModalOpen(false)}>
        <div className="text-center space-y-4">
          <p className="text-warning flex items-center justify-center gap-2">
            <Clock size={16} /> Please pay within <b className="text-lg">{expired ? 'EXPIRED' : formatCountdown(secondsLeft)}</b>
          </p>
          <div>
            <p className="opacity-70 text-sm">Transfer exactly:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-extrabold text-primary">${total}</span>
              <button type="button" className="btn btn-ghost btn-sm" aria-label="Copy amount" onClick={() => copy(total, notify)}><Copy size={16} /></button>
            </div>
          </div>

          <div className="bg-base-200 rounded-box p-5 inline-block min-w-64">
            {method === 'QR' ? (
              <>
                <img src={`https://promptpay.io/${PROMPTPAY_ID}/${total}.png`} alt="PromptPay QR" className="w-44 h-44 mx-auto bg-white p-2 rounded-lg" />
                <p className="font-bold mt-2">Scan to Pay</p>
                <p className="text-sm opacity-70">PromptPay QR</p>
              </>
            ) : (
              <>
                <p className="opacity-70">Transfer to Wallet Number</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold tracking-wider">{TRUEMONEY_NUMBER}</span>
                  <button type="button" className="btn btn-ghost btn-sm" aria-label="Copy wallet number" onClick={() => copy(TRUEMONEY_NUMBER, notify)}><Copy size={16} /></button>
                </div>
                <p className="text-warning text-sm border border-warning rounded-lg p-2 mt-3 flex items-center gap-2">
                  <TriangleAlert size={14} /> Do not round up the amount!
                </p>
              </>
            )}
          </div>

          <p className="text-sm opacity-70 flex items-center justify-center gap-2">
            <Bot size={16} className="text-info" /> Our auto-verify bot will approve your order within 1-2 minutes after the exact amount is transferred.
          </p>
          <button type="button" className="btn btn-primary btn-lg w-full" disabled={paying || expired} onClick={confirm}>
            {paying && <span className="loading loading-spinner" />}
            {paying ? 'Verifying with Bank...' : expired ? 'Time Expired - Please refresh' : 'I have transferred the money'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
