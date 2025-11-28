import { Router } from "express";
import { requireAuth } from "src/middlewares/auth.middleware";
import { requirePermission } from "src/middlewares/permission.middleware";
import { ModulesController } from "../controllers/Modules.controller";

const router = Router();

router.get("/", requireAuth, requirePermission("modules.read"), ModulesController.getModules);
router.get("/", requireAuth, requirePermission("modules.manage"), ModulesController.createModule);

export default router;
