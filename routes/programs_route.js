import express from "express";
import ProgramController from "../controllers/programs_controller.js";
import {
  checkRequesterId,
  allowedAccess,
  verifyToken,
} from "../middleware/auth.js";

const router = express.Router();
router.get("/:id", ProgramController.get);
router.get("/", ProgramController.getAll);
router.post(
  "/add",
  verifyToken,
  allowedAccess(["admin", "organization"]),
  ProgramController.add
);
router.delete(
  "/:id",
  verifyToken,
  allowedAccess("admin"),
  ProgramController.del
);
router.patch(
  "/deactivate",
  verifyToken,
  allowedAccess("admin"),
  ProgramController.deactivate
);
router.patch(
  "/edit/:id",
  verifyToken,
  allowedAccess("admin"),
  ProgramController.update
);

//organization
router.patch(
  "/self-deactivate",
  verifyToken,
  checkRequesterId,
  ProgramController.deactivate
);
router.patch(
  "/self-edit/:id",
  verifyToken,
  checkRequesterId,
  ProgramController.update
);

export default router;
