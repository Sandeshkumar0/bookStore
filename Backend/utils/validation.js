const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

export const validateAuthInput = ({ fullname, email, password } = {}, isSignup = false) => {
  const errors = {};
  const normalizedName = typeof fullname === "string" ? fullname.trim() : "";
  const normalizedEmail = normalizeEmail(email);

  if (isSignup && (normalizedName.length < 2 || normalizedName.length > 80)) {
    errors.fullname = "Name must be between 2 and 80 characters";
  }
  if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 254) {
    errors.email = "Enter a valid email address";
  }
  if (typeof password !== "string" || password.length < 8 || password.length > 72) {
    errors.password = "Password must be between 8 and 72 characters";
  }

  return { errors, fullname: normalizedName, email: normalizedEmail };
};

export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
