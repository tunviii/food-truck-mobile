import { MenuItem } from "../models/MenuItem";
import type { CreateMenuItemInput, UpdateMenuItemInput } from "../validators/menu.validator";

export async function listMenuItems(includeUnavailable = false) {
  const filter = includeUnavailable ? {} : { isAvailable: true };
  return MenuItem.find(filter).sort({ category: 1, name: 1 });
}

export async function createMenuItem(input: CreateMenuItemInput) {
  return MenuItem.create(input);
}

export async function updateMenuItem(id: string, input: UpdateMenuItemInput) {
  return MenuItem.findByIdAndUpdate(id, input, { new: true, runValidators: true });
}

export async function deleteMenuItem(id: string) {
  return MenuItem.findByIdAndDelete(id);
}
