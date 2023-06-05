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
router.post("/add", verifyToken ,ProgramController.add);
router.delete("/:id", verifyToken, ProgramController.del);
router.patch("/deactivate", verifyToken, ProgramController.deactivate);
router.patch("/edit/:id", verifyToken, checkRequesterId, ProgramController.update);

//organization
router.patch("/self-deactivate", verifyToken, checkRequesterId, ProgramController.deactivate);
router.patch("/self-edit/:id", verifyToken, checkRequesterId, ProgramController.update);

export default router;
