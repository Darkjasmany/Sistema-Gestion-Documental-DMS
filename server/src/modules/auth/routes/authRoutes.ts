import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController.js";
import { handleInputErrors } from "../../../middlewares/validation.js";

const router = Router();

// Public
router.post(
  "/",
  body("nombres").notEmpty().withMessage("Los nombres son obligatorios"),
  body("apellidos").notEmpty().withMessage("Los apellidos son obligatorios"),
  body("email").isEmail().withMessage("El email no es valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  handleInputErrors,
  AuthController.createAccount
);

export default router;
