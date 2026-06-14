import { z } from "zod";
import { menuCategories } from "../models/MenuItem";

const menuItemBodySchema = z.object({
  name: z.string().trim().min(2),
  price: z.number().nonnegative(),
  category: z.enum(menuCategories),
  imageUrl: z.string().trim().url().optional().or(z.literal("")).default(""),
  isVeg: z.boolean().optional().default(true),
  isSpicy: z.boolean().optional().default(false),
  prepTimeMinutes: z.number().int().positive().optional().default(10),
  isAvailable: z.boolean().optional().default(true),
});

export const createMenuItemSchema = z.object({
  body: menuItemBodySchema,
});

export const updateMenuItemSchema = z.object({
  body: menuItemBodySchema.partial(),
});

export const availabilitySchema = z.object({
  body: z.object({
    isAvailable: z.boolean(),
  }),
});

export type CreateMenuItemInput = z.infer<typeof menuItemBodySchema>;
export type UpdateMenuItemInput = Partial<CreateMenuItemInput>;
