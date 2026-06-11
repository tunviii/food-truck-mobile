import { Router } from "express";
import { validate } from "../middleware/error-handler";
import { loginUser, registerUser } from "../services/auth.service";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const result = await loginUser(req.body.email, req.body.password);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
