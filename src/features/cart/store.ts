import { create } from "zustand";
import type { MenuItem } from "@/features/menu/types";
import type { CartItem } from "./types";

type CartState = {
  items: CartItem[];
  lastOrderToken: number | null;
  addItem: (item: MenuItem) => void;
  increment: (menuItemId: string) => void;
  decrement: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;
  setLastOrderToken: (token: number) => void;
  totalItems: () => number;
  totalAmount: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  lastOrderToken: null,
  addItem: (item) => {
    const existing = get().items.find((cartItem) => cartItem.menuItemId === item._id);

    if (existing) {
      get().increment(item._id);
      return;
    }

    set((state) => ({
      items: [
        ...state.items,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ],
    }));
  },
  increment: (menuItemId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  },
  decrement: (menuItemId) => {
    set((state) => ({
      items: state.items
        .map((item) => (item.menuItemId === menuItemId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    }));
  },
  removeItem: (menuItemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.menuItemId !== menuItemId),
    }));
  },
  clearCart: () => set({ items: [] }),
  setLastOrderToken: (token) => set({ lastOrderToken: token }),
  totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  totalAmount: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}));
