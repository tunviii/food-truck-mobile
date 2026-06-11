import { z } from "zod";
import { orderStatuses } from "../models/Order";

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().trim().min(2),
    customerPhone: z.string().trim().min(7).max(20),
    items: z.array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().positive(),
        notes: z.string().trim().optional().default(""),
      })
    ).min(1),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(orderStatuses),
    cancelReason: z.string().trim().optional(),
  }),
});
