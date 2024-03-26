import { generalFields } from "../../Middleware/validation.js";
import joi from "joi";

export const sendMessage = joi.object({
  message: joi.string().min(1).max(200),
  sessionID: generalFields.id,
});

export const getAll = joi.object({
  page: joi.number().min(1).default(1),
  size: joi.number().min(1).max(30).default(10),
  sort: joi.string().valid("asc", "desc").default("asc"),
});

export const getMessages = joi.object({
  id: generalFields.id,
  page: joi.number().min(1).default(1),
  size: joi.number().min(1).max(30).default(10),
});
