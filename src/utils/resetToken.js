import crypto from "crypto";

// Token ko hash karo (database mein hamesha hash rakhte hain)
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Naya random token banao: asli token user ko, hash database ko
export const createResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  return { resetToken, hashedToken: hashToken(resetToken) };
};
