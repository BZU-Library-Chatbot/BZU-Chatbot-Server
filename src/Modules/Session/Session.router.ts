import { Router } from "express";
import * as sessionController from "./Controller/Session.controller";
import validation from "../../Middleware/validation";
import * as validators from "./Session.validation";
import { asyncHandler } from "../../Services/errorHandling";
import { auth, optionalAuth } from "../../Middleware/auth.middleware";

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

router.patch(
  "/title/:sessionId",
  optionalAuth(),
  validation(validators.UpdateSessionTitle),
  asyncHandler(sessionController.UpdateSessionTitle)
);

export default router;
