import { Router } from "express";
import * as feedbackController from "./controller/Feedback.controller";
import { auth, roles } from "../../Middleware/auth.middleware";
import { asyncHandler } from "../../Services/errorHandling";
import validation from "../../Middleware/validation";
import * as validators from "./Feedback.validation";
const router = Router();

router.post(
  "/:interactionId",
  auth(),
  validation(validators.createFeedback),
  asyncHandler(feedbackController.createFeedback)
);

router.get(
  "/",
  auth([roles.Admin]),
  validation(validators.getAllFeedbacks),
  asyncHandler(feedbackController.getAllFeedbacks)
)

export default router;
