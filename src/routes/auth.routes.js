import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import {
  registerSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../validations/auth.validation.js";
import {
  registerUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;

