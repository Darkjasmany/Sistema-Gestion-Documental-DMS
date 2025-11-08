import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller.js";
import { zodValidateBody, zodValidateParams } from "../../../middlewares/validateZod.middleware.js";
import {
  registerValidationSchema,
  resetPassordValidationSchema,
  validateEmailSchema,
  loginValidationSchema,
  tokenValidationSchema,
} from "@selnic/shared";

const router = Router();

// Public
router.post(
  "/create-account",
  zodValidateBody(registerValidationSchema),
  AuthController.createAccount
);

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
  zodValidateBody(resetPassordValidationSchema),
  AuthController.updatePasswordWithToken
);

// Private
export default router;
