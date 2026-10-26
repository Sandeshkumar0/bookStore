import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../context/CartProvider";

export default function Cart() {
  const { items, total, setQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <section className="page-container grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <div className="text-6xl" aria-hidden="true">📚</div>
          <h1 className="mt-5 text-4xl font-bold">Your cart is waiting for a story.</h1>
          <p className="mt-3 text-slate-500">Add a few books and they’ll stay here for your next visit.</p>
          <Link to="/courses" className="button-primary mt-7 inline-flex">Browse books</Link>
        </div>
      </section>
    );
  }

  const checkout = () => toast("Checkout integration is the next step — your cart is saved.", { icon: "🔒" });

  return (
    <section className="page-container py-12 lg:py-16">
      <div className="flex items-end justify-between gap-5">
        <div><p className="eyebrow">Your shelf</p><h1 className="section-title">Shopping cart</h1></div>
        <button type="button" onClick={clear} className="text-sm font-bold text-red-600 hover:text-red-700">Clear cart</button>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <img src={item.image} alt="" className="h-28 w-24 rounded-xl object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4"><h2 className="truncate font-bold">{item.name}</h2><span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700">
                    <button type="button" className="px-3 py-2" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}>−</button>
                    <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button type="button" className="px-3 py-2" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="text-sm text-slate-500 hover:text-red-600">Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-3xl bg-slate-900 p-6 text-white lg:sticky lg:top-28">
          <h2 className="text-xl font-bold">Order summary</h2>
          <div className="mt-6 flex justify-between border-b border-slate-700 pb-5 text-slate-300"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div className="flex justify-between py-5 text-xl font-bold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button type="button" onClick={checkout} className="button-primary w-full">Secure checkout</button>
          <p className="mt-4 text-center text-xs text-slate-400">Demo checkout — no payment will be collected.</p>
        </aside>
      </div>
    </section>
  );
}
