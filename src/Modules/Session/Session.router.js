import { Router } from "express";
import * as sessionController from "./Controller/Session.controller.js";
import validation from "../../Middleware/validation.js";
import * as validators from "./Session.validation.js";
import { asyncHandler } from "../../Services/errorHandling.js";
import { auth } from "../../Middleware/auth.middleware.js";

const router = Router();

router.post(
  "/message",
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
