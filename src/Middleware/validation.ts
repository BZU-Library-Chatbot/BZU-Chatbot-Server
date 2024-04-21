import joi from "joi";
import { Types } from "mongoose";
import userModel from "../../DB/model/User.model.ts";
import { roles } from "./auth.middleware.ts";
import { verifyToken } from "../Services/generateAndVerifyToken.ts";

export const validationObjectId = (value: any, helper: any) => {
  if (Types.ObjectId.isValid(value)) {
    return true;
  } else {
    return helper.message("id is invalid");
  }
};

const validationRefreshToken = async (value: any) => {
  try {
    const decoded = verifyToken(
      value.split(process.env.BEARERKEY)[1],
      process.env.REFRESH_TOKEN
    );
    const user = await userModel.findById(decoded?.id);
    if (!user) {
      const error = new Error("not register account") as any;
      error.cause = 400;

      return error;
    }
    if (!Object.values(roles).includes(user.role)) {
      const error = new Error("not authorized") as any;
      error.cause = 400;

      return error;
    }

    if (parseInt(user.changePasswordTime) > decoded.iat) {
      const error = new Error("expired token") as any;
      error.cause = 400;

      return error;
    }

    return true;
  } catch (err) {
    return false;
  }
};

export const generalFields = {
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "edu"] } }),
  password: joi.string().min(8).required(),
  file: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().positive().required(),
    dest: joi.string(),
  }),
  id: joi.string().custom(validationObjectId),
  refreshToken: joi.string().custom(validationRefreshToken),
};

const validation = (schema) => {
  return (req, res, next) => {
    const inputsData = req.file
      ? { ...req.body, ...req.params, ...req.query, file: req.file }
      : req.files
      ? { ...req.body, ...req.params, ...req.query, files: { ...req.files } }
      : { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(inputsData, { abortEarly: false });
    if (validationResult.error?.details) {
      return res.json({
        message: "validation error",
        error: validationResult.error.details,
      });
    }
    return next();
  };
};

export default validation;
