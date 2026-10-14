export const forgotPasswordOtpEmail = (otp, minutes) => ({
  subject: "Password Reset OTP",
  text: `Aapka password reset OTP ${otp} hai. Ye ${minutes} minute mein expire ho jayega. Isay kisi ko mat batayein.`,
});
