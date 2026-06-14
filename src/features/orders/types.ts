import type { MenuItem } from "@/features/menu/types";

export type OrderStatus =
  | "placed"
  | "accepted"
  | "cooking"
  | "ready"
  | "completed"
  | "cancelled";

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    notes?: string;
  }>;
};

export type Order = {
  _id: string;
  tokenNumber: number;
  customerName: string;
  customerPhone: string;
  items: Array<{
    menuItem: MenuItem["_id"];
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }>;
  status: OrderStatus;
  totalAmount: number;
  estimatedPrepTimeMinutes: number;
  paymentStatus: "unpaid" | "paid" | "refunded";
  cancelReason?: string;
  createdAt?: string;
  updatedAt?: string;
};
