import { api } from "@/lib/api/client";
import type { MenuItem, MenuItemInput } from "./types";

export async function getMenuItems(includeUnavailable = false) {
  const response = await api.get<MenuItem[]>("/menu", {
    params: includeUnavailable ? { includeUnavailable: true } : undefined,
  });
  return response.data;
}

export async function createMenuItem(input: MenuItemInput) {
  const response = await api.post<MenuItem>("/menu", input);
  return response.data;
}

export async function updateMenuItem(id: string, input: Partial<MenuItemInput>) {
  const response = await api.put<MenuItem>(`/menu/${id}`, input);
  return response.data;
}

export async function updateMenuItemAvailability(id: string, isAvailable: boolean) {
  const response = await api.patch<MenuItem>(`/menu/${id}/availability`, { isAvailable });
  return response.data;
}

export async function deleteMenuItem(id: string) {
  await api.delete(`/menu/${id}`);
}
