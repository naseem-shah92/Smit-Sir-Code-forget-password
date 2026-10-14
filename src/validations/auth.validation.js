import Joi from "joi";
import { passwordRegex } from "../utils/auth.regex.js";

export const registerSchema = Joi.object({
  fullname: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "Password mein kam az kam 8 characters, 1 capital, 1 small, 1 number aur 1 special character (@$!%*?&) hona chahiye",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    "string.length": "OTP 6 digit ka hona chahiye",
    "string.pattern.base": "OTP mein sirf numbers hone chahiye",
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "Password mein kam az kam 8 characters, 1 capital, 1 small, 1 number aur 1 special character (@$!%*?&) hona chahiye",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Dono passwords match nahi karte",
  }),
});

