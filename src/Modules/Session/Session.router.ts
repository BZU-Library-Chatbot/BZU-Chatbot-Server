import { Router } from "express";
import * as sessionController from "./Controller/Session.controller.ts";
import validation from "../../Middleware/validation.ts";
import * as validators from "./Session.validation.ts";
import { asyncHandler } from "../../Services/errorHandling.ts";
import { auth, optionalAuth } from "../../Middleware/auth.middleware.ts";

const router = Router();

router.post(
  "/message",
  optionalAuth(),
  validation(validators.sendMessage),
  asyncHandler(sessionController.sendMessage)
);

router.get(
  "/",
  auth(),
  validation(validators.getAll),
  asyncHandler(sessionController.getAll)
);

router.get(
  "/:id",
  auth(),
  validation(validators.getMessages),
  asyncHandler(sessionController.getMessages)
);

export default router;
