import { z } from "zod";
import { userRoles } from "../models/User";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8),
    role: z.enum(userRoles).optional().default("customer"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
  }),
});
