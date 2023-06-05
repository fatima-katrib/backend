import express from "express";
import {
  getAll,
  getOrg,
  getUser,
  get,
  register,
  login,
  logout,
  del,
  update,
} from "../controllers/users_controller.js";
import {
  checkRequesterId,
  allowedAccess,
  verifyToken,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", get);
router.get("/organizations", getOrg);
router.get("/users", getUser);
router.get("/", getAll);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/:id", del);
router.patch("/edit/:id", verifyToken, update);
router.patch("/self-edit/:id", verifyToken, checkRequesterId, update);

export default router;
