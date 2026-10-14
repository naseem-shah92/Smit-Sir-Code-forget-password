import {
  registerUserService,
  forgotPasswordService,
  verifyOtpService,
  resetPasswordService,
} from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  const user = await registerUserService(req.body);

  res.status(201).json({ message: "Registration successful", user });
};

export const forgotPassword = async (req, res) => {
  await forgotPasswordService(req.body);

  res.status(200).json({
    message: "Agar ye email registered hai to OTP bhej diya gaya hai",
  });
};

export const verifyOtp = async (req, res) => {
  const resetToken = await verifyOtpService(req.body);

  res.status(200).json({ message: "OTP verified", resetToken });
};

export const resetPassword = async (req, res) => {
  await resetPasswordService(req.body);

  res.status(200).json({
    message: "Password reset ho gaya, ab naye password se login karein",
  });
};