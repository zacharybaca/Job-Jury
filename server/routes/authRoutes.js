import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  isUserAdmin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/is-admin", isUserAdmin);

export default router;
