import userModel from "../../DB/model/User.model.ts";
import { asyncHandler } from "../Services/errorHandling.ts";
import { verifyToken } from "../Services/generateAndVerifyToken.ts";

export const roles = {
  Admin: "Admin",
  User: "User",
  HR: "Super Admin",
};

export const auth = (accessRoles = Object.values(roles)) => {
  return asyncHandler(async (req: any, res: any, next: any) => {
    const { authorization } = req.headers;

    if (!authorization?.startsWith(process.env.BEARERKEY)) {
      const error = new Error("invalid bearer key") as any;
      error.cause = 400;

      return next(error);
    }
    const token = authorization.split(process.env.BEARERKEY)[1];
    if (!token) {
      const error = new Error("invalid token") as any;
      error.cause = 400;

      return next(error);
    }
    const decoded = verifyToken(token, process.env.LOGIN_TOKEN);
    if (!decoded) {
      const error = new Error("invalid token") as any;
      error.cause = 401;

      return next(error);
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      const error = new Error("not register account") as any;
      error.cause = 400;

      return next(error);
    }
    if (!accessRoles.includes(user.role)) {
      const error = new Error("expired token") as any;
      error.cause = 403;

      return next(error);
    }

    if (parseInt(user.changePasswordTime) > decoded.iat) {
      const error = new Error("expired token") as any;
      error.cause = 401;

      return next(error);
    }

    req.user = user;
    return next();
  });
};

export const optionalAuth = (accessRoles = Object.values(roles)) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return next();
    }

    if (!authorization?.startsWith(process.env.BEARERKEY)) {
      const error = new Error("invalid bearer key") as any;
      error.cause = 400;

      return next(error);
    }
    const token = authorization.split(process.env.BEARERKEY)[1];
    if (!token) {
      const error = new Error("invalid token") as any;
      error.cause = 400;

      return next(error);
    }
    const decoded = verifyToken(token, process.env.LOGIN_TOKEN);
    if (!decoded) {
      const error = new Error("invalid token") as any;
      error.cause = 401;

      return next(error);
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      const error = new Error("not register account") as any;
      error.cause = 400;

      return next(error);
    }
    if (!accessRoles.includes(user.role)) {
      const error = new Error("not register account") as any;
      error.cause = 403;

      return next(error);
    }

    if (parseInt(user.changePasswordTime) > decoded.iat) {
      const error = new Error("expired token") as any;
      error.cause = 401;

      return next(error);
    }
    req.user = user;
    return next();
  });
};
