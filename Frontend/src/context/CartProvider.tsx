import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { Book, CartItem } from "../types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (book: Book) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "bookstore_cart";

function readCart(): CartItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "[]") as unknown;
    return Array.isArray(value) ? (value as CartItem[]) : [];
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart);

  const update = useCallback((updater: (current: CartItem[]) => CartItem[]) => {
    setItems((current) => {
      const next = updater(current);
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, []);

  const addItem = useCallback(
    (book: Book) => {
      update((current) => {
        const existing = current.find((item) => item.id === book._id);
        if (existing) {
          return current.map((item) =>
            item.id === book._id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [
          ...current,
          {
            id: book._id,
            name: book.name,
            image: book.image,
            price: Number(book.price) || 0,
            quantity: 1,
          },
        ];
      });
    },
    [update],
  );

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      update((current) =>
        quantity <= 0
          ? current.filter((item) => item.id !== id)
          : current.map((item) => (item.id === id ? { ...item, quantity } : item)),
      );
    },
    [update],
  );

  const removeItem = useCallback(
    (id: string) => update((current) => current.filter((item) => item.id !== id)),
    [update],
  );
  const clear = useCallback(() => update(() => []), [update]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [addItem, clear, items, removeItem, setQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
