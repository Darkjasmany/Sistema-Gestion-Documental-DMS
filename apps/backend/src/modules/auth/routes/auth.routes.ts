import {
  loginValidationSchema,
  registerBaseSchema,
  tokenValidationSchema,
  validateEmailSchema,
} from "@selnic/shared";
import { passwordMatchSchema } from "@selnic/shared/validations/auth.validations.js";
import { Router } from "express";
import { zodValidateBody, zodValidateParams } from "../../../middlewares/validateZod.middleware.js";
import { AuthController } from "../controllers/Auth.controller.js";

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

router.post(
  "/validate-token",
  zodValidateBody(tokenValidationSchema),
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  zodValidateParams(tokenValidationSchema),
  zodValidateBody(passwordMatchSchema),
  AuthController.updatePasswordWithToken
);

// Private
export default router;
