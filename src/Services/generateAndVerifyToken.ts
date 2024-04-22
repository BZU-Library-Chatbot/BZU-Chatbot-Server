import jwt from "jsonwebtoken";
import { asyncHandler } from "./errorHandling.ts";

export const generateToken = (
  payload,
  signature = process.env.TOKEN_SIGNATURE,
  expiresIn: any = ""
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
    console.log("error: " + error);

    return null;
  }
};
