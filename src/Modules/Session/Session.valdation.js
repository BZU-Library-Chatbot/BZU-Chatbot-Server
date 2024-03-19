import { generalFields } from "../../Middleware/validation.js";
import joi from "joi";

export const sendMessage = joi.object({
  userID:generalFields.id,
  message: joi.string().min(1).max(200),
  sessionID:generalFields.id,
});
