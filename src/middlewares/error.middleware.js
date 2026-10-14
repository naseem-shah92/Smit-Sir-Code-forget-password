import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  // Hamari apni banayi hui ghalti: jo status aur message diya wohi bhejo
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Postman mein galat JSON bheja gaya
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON" });
  }

  // Koi anjaani ghalti: andar ka haal user ko mat dikhao
  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Something went wrong" });
};
