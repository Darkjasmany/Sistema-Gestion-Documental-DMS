import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { validateBody } from "../../../middlewares/validateBody.js";
import { createUserSchema } from "../../administration/types/schemas/userSchema.js";

const router = Router();

// Public
router.post(
  "/create-account",
  validateBody(createUserSchema),
  AuthController.createAccount
);

// Private
export default router;
