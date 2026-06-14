import { Schema, model, type InferSchemaType } from "mongoose";

export const menuCategories = [
  "mains",
  "snacks",
  "drinks",
  "desserts",
  "combos",
] as const;

const menuItemSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: menuCategories, required: true },
    imageUrl: { type: String, trim: true, default: "" },
    isVeg: { type: Boolean, default: true },
    isSpicy: { type: Boolean, default: false },
    prepTimeMinutes: { type: Number, required: true, min: 1, default: 10 },
    isAvailable: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type MenuItemDocument = InferSchemaType<typeof menuItemSchema>;
export const MenuItem = model("MenuItem", menuItemSchema);
