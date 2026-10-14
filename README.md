# Auth Practice - Forgot & Reset Password Flow

Node.js, Express 5, aur Mongoose ke zariye banaya gaya secure authentication aur password reset system with OTP verification.

## 🚀 Setup & Installation

1. Dependencies install karein:
```bash
npm install
```

2. Environment variables set karein:
`.env.example` ko copy karke `.env` banayein aur apni details bharein:
```bash
cp .env.example .env
```

3. Server start karein:
```bash
npm run dev
```
Server default port `4000` par run hoga.

---

## 📌 API Endpoints

### 1. User Registration
* **Endpoint:** `POST /api/auth/register`
* **Body:**
  ```json
  {
    "fullname": "Aaban Shah",
    "email": "aaban@example.com",
    "password": "Password@123"
  }
  ```
* **Response (201):**
  ```json
  {
    "message": "Registration successful",
    "user": { "id": "...", "fullname": "...", "email": "..." }
  }
  ```

---

### 2. Forgot Password (Request OTP)
* **Endpoint:** `POST /api/auth/forgot-password`
* **Body:**
  ```json
  {
    "email": "aaban@example.com"
  }
  ```
* **Response (200):**
  ```json
  {
    "message": "Agar ye email registered hai to OTP bhej diya gaya hai"
  }
  ```

---

### 3. Verify OTP
* **Endpoint:** `POST /api/auth/verify-otp`
* **Body:**
  ```json
  {
    "email": "aaban@example.com",
    "otp": "123456"
  }
  ```
* **Response (200):**
  ```json
  {
    "message": "OTP verified",
    "resetToken": "64_characters_hex_token"
  }
  ```

---

### 4. Reset Password
* **Endpoint:** `POST /api/auth/reset-password`
* **Body:**
  ```json
  {
    "token": "64_characters_hex_token",
    "newPassword": "NewPassword@123",
    "confirmPassword": "NewPassword@123"
  }
  ```
* **Response (200):**
  ```json
  {
    "message": "Password reset ho gaya, ab naye password se login karein"
  }
  ```

---

## 🛡️ Security Features
* **User Enumeration Protection:** `forgot-password` par registered aur unregistered email dono par `200 OK` return hota hai.
* **TOTP / Time-based OTP:** 6-digit OTP `otplib` se banta hai aur 5 minutes mein expire hota hai.
* **Brute-Force Protection:** Max 5 galat attempts ke baad OTP delete ho jata hai.
* **Hashed Reset Token:** Single-use 32-byte crypto token jo database mein `sha256` hash ke sath save hota hai aur password update hone ke baad foran delete ho jata hai.
* **Layered Architecture:** Routes → Middlewares → Controllers → Services → Models.
