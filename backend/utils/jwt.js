import jwt from "jsonwebtoken";

const ACCESS_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "15m";
const REFRESH_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || "7d";
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRE });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRE });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
