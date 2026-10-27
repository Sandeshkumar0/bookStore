import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../context/CartProvider";
import Reveal from "./Reveal";

export default function Cart() {
  const { items, count, total, setQuantity, removeItem, clear } = useCart();

  return (
    <div className="bag-page page-frame">
      <Reveal className="bag-header">
        <div>
          <p className="kicker dark"><span>●</span> Reading bag / {String(count).padStart(2, "0")}</p>
          <h1>Books held<br /><em>in reserve.</em></h1>
        </div>
        <p>A temporary shelf for the works you want nearby. Your selection remains on this device when you leave.</p>
      </Reveal>

      {items.length === 0 ? (
        <section className="empty-bag">
          <span aria-hidden="true">∅</span>
          <h2>The bag is beautifully empty.</h2>
          <p>There is room for a first title—and no recommendation engine watching over your shoulder.</p>
          <Link to="/courses">Enter the index ↗</Link>
        </section>
      ) : (
        <div className="bag-layout">
          <section className="bag-items" aria-label="Books in your reading bag">
            {items.map((item, index) => (
              <article className="bag-item" key={item.id}>
                <span className="bag-item-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="bag-cover"><img src={item.image} alt="" /></div>
                <div className="bag-item-copy"><span>Selected work</span><h2>{item.name}</h2><p>{item.price === 0 ? "Open access" : `$${item.price.toFixed(2)} each`}</p></div>
                <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                  <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                  <output>{item.quantity}</output>
                  <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">＋</button>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                <button className="remove-item" type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>Remove ×</button>
              </article>
            ))}
          </section>
          <aside className="bag-summary">
            <span>Acquisition note</span>
            <div><span>{count} {count === 1 ? "volume" : "volumes"}</span><span>${total.toFixed(2)}</span></div>
            <div><span>Delivery</span><span>Calculated later</span></div>
            <div className="bag-total"><span>Estimated total</span><strong>${total.toFixed(2)}</strong></div>
            <button type="button" onClick={() => toast.success("Checkout hand-off is ready for payment integration")}>Continue to checkout <span>↗</span></button>
            <small>Secure checkout can be connected to your preferred payment provider.</small>
            <button type="button" className="clear-bag" onClick={clear}>Clear this bag</button>
          </aside>
        </div>
      )}
    </div>
  );
}
