import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/error-handler";
import { createMenuItem, deleteMenuItem, listMenuItems, updateMenuItem } from "../services/menu.service";
import { availabilitySchema, createMenuItemSchema, updateMenuItemSchema } from "../validators/menu.validator";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const includeUnavailable = req.query.includeUnavailable === "true";
    const menu = await listMenuItems(includeUnavailable);
    return res.json(menu);
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, requireRole("admin"), validate(createMenuItemSchema), async (req, res, next) => {
  try {
    const item = await createMenuItem(req.body);
    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), validate(updateMenuItemSchema), async (req, res, next) => {
  try {
    const item = await updateMenuItem(String(req.params.id), req.body);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    return res.json(item);
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/availability", requireAuth, requireRole("admin"), validate(availabilitySchema), async (req, res, next) => {
  try {
    const item = await updateMenuItem(String(req.params.id), { isAvailable: req.body.isAvailable });
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    return res.json(item);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const item = await deleteMenuItem(String(req.params.id));
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
