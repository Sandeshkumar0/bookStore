import toast from "react-hot-toast";

import { useCart } from "../context/CartProvider";

export default function Cards({ item }) {
  const { addItem } = useCart();
  const price = Number(item.price) || 0;

  const addToCart = () => {
    addItem(item);
    toast.success(`${item.name} added to your cart`);
  };

  return (
    <article className="book-card group">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={item.image}
          alt={`Cover of ${item.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-bold">{item.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.title}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{price === 0 ? "Free" : `$${price.toFixed(2)}`}</span>
          <button type="button" onClick={addToCart} className="button-primary px-4 py-2 text-sm">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
