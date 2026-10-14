import { generateSecret, generateSync, verifySync } from "otplib";
import { OTP_EXPIRY_MINUTES } from "../constants/auth.constant.js";

const OTP_PERIOD = OTP_EXPIRY_MINUTES * 60; // seconds



// Naya secret aur uska 6 digit OTP banao
export const createOtp = () => {
  const secret = generateSecret();
  const otp = generateSync({ secret, strategy: "totp", period: OTP_PERIOD });
  return { secret, otp };
};

// Check karo ke OTP is secret se bana tha ya nahi (true / false)
export const isOtpValid = (secret, otp) => {
  const result = verifySync({
    secret,
    token: otp,
    strategy: "totp",
    period: OTP_PERIOD,
    epochTolerance: [OTP_PERIOD, 0],
  });
  return result.valid;
};
