import { Router } from "express";
import * as AuthController from "./controller/Auth.controller";
import { asyncHandler } from "../../Services/errorHandling";
import validation from "../../Middleware/validation";
import * as validators from "./Auth.validation";
import { auth, roles } from "../../Middleware/auth.middleware";
const router = Router({ caseSensitive: true });

router.post(
  "/signup",
  validation(validators.signup),
  asyncHandler(AuthController.signup)
);

router.post(
  "/login",
  validation(validators.loginSchema),
  asyncHandler(AuthController.login)
);

router.get(
  "/confirmEmail/:token",
  validation(validators.confirmEmail),
  asyncHandler(AuthController.confirmEmail)
);

router.get(
  "/newConfirmEmail/:token",
  validation(validators.confirmEmail),
  asyncHandler(AuthController.newConfirmEmail)
);

router.patch(
  "/sendCode",
  validation(validators.sendCode),
  asyncHandler(AuthController.sendCode)
);

router.patch(
  "/forgetPassword",
  validation(validators.forgetPassword),
  asyncHandler(AuthController.forgetPassword)
);

router.post(
  "/refresh",
  validation(validators.refresh),
  asyncHandler(AuthController.refreshToken)
);

router.get(
  "/admin",
  auth([roles.Admin]),
  validation(validators.getAllAdmins),
  asyncHandler(AuthController.getAllAdmins)
);

router.post(
  "/createAdmin",
  auth([roles.Admin]),
  validation(validators.createAdmin),
  asyncHandler(AuthController.createAdmin)
);

export default router;
