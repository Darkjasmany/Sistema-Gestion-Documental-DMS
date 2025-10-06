import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { validateBody } from "../../../middlewares/validateBody.js";
import {
  createUserSchema,
  validateEmailSchema,
  validateLoginSchema,
  validateTokenSchema,
} from "../schema/userAuthSchema.js";

const router = Router();

// Public
router.post(
  "/create-account",
  validateBody(createUserSchema),
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  validateBody(validateTokenSchema),
  AuthController.confirmAccount
);

router.post("/login", validateBody(validateLoginSchema), AuthController.login);

router.post(
  "/forgot-password",
  validateBody(validateEmailSchema),
  AuthController.forgotPassword
);

router.post('/validate-token', validateBody(validateTokenSchema), AuthController.validateToken)

router.post('/update-password/:token', AuthController.updatePasswordWithToken)

// Private
export default router;
