import jwt from "jsonwebtoken";
import { asyncHandler } from "./errorHandling.js";

export const generateToken = (
  payload,
  signature = process.env.TOKEN_SIGNATURE,
  expiresIn = ""
) => {
  if (expiresIn) {
    const token = jwt.sign(payload, signature, { expiresIn });
    return token;
  } else {
    const token = jwt.sign(payload, signature);
    return token;
  }
};

export const verifyToken = (token, signature = process.env.TOKEN_SIGNATURE) => {
  try {
    const decoded = jwt.verify(token, signature);
    return decoded;
  } catch (error) {
    return null;
    }
}