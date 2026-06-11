import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/error-handler";
import { createOrder, findOrderByToken, listOrders, updateOrderStatus } from "../services/order.service";
import { orderStatuses, type OrderStatus } from "../models/Order";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.validator";

const router = Router();

router.post("/", validate(createOrderSchema), async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
});

router.get("/", requireAuth, requireRole("admin", "kitchen"), async (req, res, next) => {
  try {
    const status = orderStatuses.includes(req.query.status as OrderStatus)
      ? (req.query.status as OrderStatus)
      : undefined;
    const orders = await listOrders(status);
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
});

router.get("/token/:tokenNumber", async (req, res, next) => {
  try {
    const tokenNumber = Number(req.params.tokenNumber);
    if (!Number.isInteger(tokenNumber)) {
      return res.status(400).json({ message: "Invalid token number" });
    }

    const order = await findOrderByToken(tokenNumber);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/status", requireAuth, requireRole("admin", "kitchen"), validate(updateOrderStatusSchema), async (req, res, next) => {
  try {
    const order = await updateOrderStatus(String(req.params.id), req.body.status, req.body.cancelReason);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
});

export default router;
