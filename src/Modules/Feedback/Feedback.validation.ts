import { generalFields } from "../../Middleware/validation";
import joi from "joi";

export const createFeedback = joi
  .object({
    text: joi.string().min(2).max(50),
    rating: joi.number().min(0).max(5).required(),
    interactionId: generalFields.id.required(),
  })  .required();
  