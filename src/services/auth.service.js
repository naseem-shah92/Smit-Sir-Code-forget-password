import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { createOtp, isOtpValid } from "../utils/otp.js";
import { createResetToken, hashToken } from "../utils/resetToken.js";
import sendEmail from "../utils/sendEmail.js";
import { ApiError } from "../utils/ApiError.js";
import { forgotPasswordOtpEmail } from "../emailTemplates/auth.templates.js";
import {
  OTP_EXPIRY_MINUTES,
  OTP_MAX_ATTEMPTS,
  RESET_TOKEN_EXPIRY_MINUTES,
} from "../constants/auth.constant.js";

const minutesFromNow = (minutes) => new Date(Date.now() + minutes * 60 * 1000);

// Har ghalat OTP par yehi message, taake hacker ko kuch pata na chale
const INVALID_OTP_MESSAGE = "OTP galat hai ya expire ho gaya";

export const registerUserService = async ({ fullname, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  try {
    const user = await User.create({ fullname, email, password });
    return { id: user._id, fullname: user.fullname, email: user.email };
  } catch (error) {
    // Do log ek hi waqt par same email se register karein to yahan pakra jata hai
    if (error.code === 11000) {
      throw new ApiError(409, "Email already registered");
    }
    throw error;
  }
};

export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) return; // chup chaap wapas, controller ka jawab dono surtoon mein same hai

  const { secret, otp } = createOtp();

  // Is email ka purana OTP (agar hai) badal do, warna naya bana do
  await Otp.findOneAndUpdate(
    { email },
    {
      $set: {
        secret,
        attempts: 0,
        expiresAt: minutesFromNow(OTP_EXPIRY_MINUTES),
      },
    },
    { upsert: true },
  );

  try {
    const { subject, text } = forgotPasswordOtpEmail(otp, OTP_EXPIRY_MINUTES);
    await sendEmail({ to: user.email, subject, text });
  } catch (error) {
    // Email nahi gayi to OTP ka koi faida nahi, usay hata do
    await Otp.deleteOne({ email });
    console.error("OTP email failed:", error.message);
    throw new ApiError(500, "OTP email nahi bhej saka, dobara koshish karein");
  }
};

export const verifyOtpService = async ({ email, otp }) => {
  const otpRecord = await Otp.findOne({ email }).select("+secret");
  if (!otpRecord) {
    throw new ApiError(400, INVALID_OTP_MESSAGE);
  }

  const isExpired = otpRecord.expiresAt < new Date();
  const tooManyAttempts = otpRecord.attempts >= OTP_MAX_ATTEMPTS;
  if (isExpired || tooManyAttempts) {
    await Otp.deleteOne({ _id: otpRecord._id });
    throw new ApiError(400, INVALID_OTP_MESSAGE);
  }

  if (!isOtpValid(otpRecord.secret, otp)) {
    await Otp.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });
    throw new ApiError(400, INVALID_OTP_MESSAGE);
  }

  // OTP sahi hai: usay hamesha ke liye hata do, phir reset token banao
  await Otp.deleteOne({ _id: otpRecord._id });

  const { resetToken, hashedToken } = createResetToken();

  await User.updateOne(
    { email },
    {
      $set: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: minutesFromNow(RESET_TOKEN_EXPIRY_MINUTES),
      },
    },
  );

  return resetToken;
};

export const resetPasswordService = async ({ token, newPassword }) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Reset token galat hai ya expire ho gaya");
  }

  user.password = newPassword; // pre("save") hook isay bcrypt se hash karega
  user.resetPasswordToken = undefined; // token single-use hai
  user.resetPasswordExpires = undefined;

  await user.save();
};

