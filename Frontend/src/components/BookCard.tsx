import { type CSSProperties, type PointerEvent, useRef } from "react";
import toast from "react-hot-toast";

import { useCart } from "../context/CartProvider";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { Book } from "../types";

export default function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  const card = useRef<HTMLElement>(null);
  const { addItem } = useCart();
  const reducedMotion = useReducedMotion();
  const price = Number(book.price) || 0;

  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || !card.current) return;
    const bounds = card.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.current.style.setProperty("--tilt-x", `${-y * 4}deg`);
    card.current.style.setProperty("--tilt-y", `${x * 5}deg`);
  };

  const reset = () => {
    card.current?.style.setProperty("--tilt-x", "0deg");
    card.current?.style.setProperty("--tilt-y", "0deg");
  };

  const add = () => {
    addItem(book);
    toast.success(`${book.name} catalogued in your bag`);
  };

  return (
    <article
      ref={card}
      className="book-object"
      onPointerMove={tilt}
      onPointerLeave={reset}
      style={{ "--book-order": index } as CSSProperties}
    >
      <div className="book-image-wrap">
        <span className="book-serial">BK—{String(index + 1).padStart(3, "0")}</span>
        <img
          src={book.image}
          alt={`Cover artwork for ${book.name}`}
          loading="lazy"
          onError={(event) => { event.currentTarget.style.opacity = "0"; }}
        />
        <div className="book-category">{book.category}</div>
      </div>
      <div className="book-meta">
        <div>
          <h3>{book.name}</h3>
          <p>{book.title}</p>
        </div>
        <div className="book-action-row">
          <span>{price === 0 ? "Open access" : `$${price.toFixed(2)}`}</span>
          <button type="button" onClick={add} aria-label={`Add ${book.name} to reading bag`}>
            Add <span aria-hidden="true">＋</span>
          </button>
        </div>
      </div>
    </article>
  );
}
