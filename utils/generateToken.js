import jwt from "jsonwebtoken";

export const generateToken = (userId, email, expiresIn = "7d") => {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in environment");
  }

  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn });
};

export const generateAuthTokens = (user) => {
  const accessToken = generateToken(user._id, user.role, "15m");
  const refreshToken = generateToken(user._id, user.role, "7d");
  return { accessToken, refreshToken };
};
