import jwt from "jsonwebtoken";

export const generateToken = (
  payload: any,
  signature: any = process.env.TOKEN_SIGNATURE,
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

export const verifyToken = (
  token: any,
  signature: any = process.env.TOKEN_SIGNATURE
) => {
  try {
    const decoded = jwt.verify(token, signature);
    return decoded;
  } catch (error) {
    console.log("error: " + error);

    return null;
  }
};
