import { api } from "@/lib/api/client";
import type { CreateOrderInput, Order, OrderStatus } from "./types";

export async function createOrder(input: CreateOrderInput) {
  const response = await api.post<Order>("/orders", input);
  return response.data;
}

export async function getOrderByToken(tokenNumber: number) {
  const response = await api.get<Order>(`/orders/token/${tokenNumber}`);
  return response.data;
}

export async function getOrders(status?: OrderStatus) {
  const response = await api.get<Order[]>("/orders", {
    params: status ? { status } : undefined,
  });
  return response.data;
}

export async function updateOrderStatus(id: string, status: OrderStatus, cancelReason?: string) {
  const response = await api.patch<Order>(`/orders/${id}/status`, {
    status,
    cancelReason,
  });
  return response.data;
}
