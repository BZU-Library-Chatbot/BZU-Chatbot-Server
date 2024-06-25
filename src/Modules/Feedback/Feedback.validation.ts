import { generalFields } from "../../Middleware/validation";
import joi from "joi";

export const createFeedback = joi
  .object({
    text: joi.string().min(2).max(100),
    rating: joi.number().min(1).max(5).required(),
    interactionId: generalFields.id.required(),
  })
  .required();

export const getAllFeedbacks = joi
  .object({
    page: joi.number().min(1).default(1),
    size: joi.number().min(1).default(10),
    sort: joi.string(),
  })
  .required();

export const deleteFeedback = joi
  .object({
    feedbackId: generalFields.id.required(),
  })
  .required();
