import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller.js";
import { zodValidateBody, zodValidateParams } from "../../../middlewares/validateZod.middleware.js";
// import {
//   createUserSchema,
//   validateEmailSchema,
//   validateLoginSchema,
//   validateTokenSchema,
//   updatePasswordSchema,
// } from "@selnic/shared/src/schemas/auth.js";

const router = Router();

// Public
router.post(
  "/create-account",
  // zodValidateBody(createUserSchema),
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  // zodValidateBody(validateTokenSchema),
  AuthController.confirmAccount
);

router.post(
  "/login",
  // zodValidateBody(validateLoginSchema),
  AuthController.login
);

router.post(
  "/forgot-password",
  // zodValidateBody(validateEmailSchema),
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  // zodValidateBody(validateTokenSchema),
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  // zodValidateParams(validateTokenSchema),
  // zodValidateBody(updatePasswordSchema),
  AuthController.updatePasswordWithToken
);

// Private
export default router;
