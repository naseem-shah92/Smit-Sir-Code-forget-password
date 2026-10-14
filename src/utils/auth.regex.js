// Kam az kam 1 capital, 1 small, 1 number, 1 special character, aur 8+ characters
export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;