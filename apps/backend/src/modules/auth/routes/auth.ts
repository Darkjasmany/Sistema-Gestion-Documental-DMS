import {
  loginValidationSchema,
  registerBaseSchema,
  tokenValidationSchema,
  updatePasswordSchema,
  validateEmailSchema,
} from "@selnic/shared";
import { Router } from "express";
import { zodValidateBody, zodValidateParams } from "../../../middlewares/validateZod.js";
import { AuthController } from "../controllers/Auth.js";

const router = Router();

// Public
router.post("/create-account", zodValidateBody(registerBaseSchema), AuthController.createAccount);

router.post(
  "/confirm-account",
  zodValidateBody(tokenValidationSchema),
  AuthController.confirmAccount
);

router.post("/login", zodValidateBody(loginValidationSchema), AuthController.login);

router.post(
  "/forgot-password",
  zodValidateBody(validateEmailSchema),
  AuthController.forgotPassword
);

router.post("/validate-token", zodValidateBody(validateEmailSchema), AuthController.validateToken);

router.post(
  "/update-password/:token",
  zodValidateParams(tokenValidationSchema),
  zodValidateBody(updatePasswordSchema),
  AuthController.updatePasswordWithToken
);

// Private
export default router;
