import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);
const storageKey = "bookstore_cart";

const readCart = () => {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

export default function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  const update = (updater) => {
    setItems((current) => {
      const next = updater(current);
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const addItem = (book) => {
    const id = book._id || book.id;
    update((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...current,
        {
          id,
          name: book.name,
          image: book.image,
          price: Number(book.price) || 0,
          quantity: 1,
        },
      ];
    });
  };

  const setQuantity = (id, quantity) => {
    update((current) =>
      quantity <= 0
        ? current.filter((item) => item.id !== id)
        : current.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      count,
      total,
      addItem,
      setQuantity,
      removeItem: (id) => update((current) => current.filter((item) => item.id !== id)),
      clear: () => update(() => []),
    };
    // Cart actions always use functional state updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
