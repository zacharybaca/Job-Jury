import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  isUserAdmin,
  forgotPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/is-admin", isUserAdmin); // Route to check if the user is an admin
router.post('/forgotpassword', forgotPassword);

export default router;
