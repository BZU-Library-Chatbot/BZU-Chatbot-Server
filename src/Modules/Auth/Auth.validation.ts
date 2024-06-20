import joi from "joi";
import { generalFields } from "../../Middleware/validation";

export const loginSchema = joi
  .object({
    email: generalFields.email,
    password: joi.string().min(8).required(),
  })
  .required();

export const refresh = joi
  .object({
    refreshToken: generalFields.refreshToken.required(),
  })
  .required();

export const sendCode = joi
  .object({
    email: generalFields.email.required(),
  })
  .required();

export const forgetPassword = joi
  .object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    code: joi.string().min(4).max(4).required(),
    cPassword: joi.any().valid(joi.ref("password")).required().messages({
      "any.only": "Does not match password",
    }),
  })
  .required();

export const signup = joi
  .object({
    userName: joi.string().min(3).max(40).required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    cPassword: joi.any().valid(joi.ref("password")).required().messages({
      "any.only": "Does not match password",
    }),
  })
  .required();

export const confirmEmail = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const getAllAdmins = joi
  .object({
    page: joi.number().min(1).default(1),
    limit: joi.number().min(1).default(10),
    active: joi.boolean(),
  })
  .required();

  export const activate = joi.object({
    adminId:generalFields.id.required(),
  })
  .required();

  export const deActivate = joi.object({
    adminId:generalFields.id.required(),
  })
  .required();


  export const createAdmin = joi
  .object({
    userName: joi.string().min(3).max(40).required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    cPassword: joi.any().valid(joi.ref("password")).required().messages({
      "any.only": "Does not match password",
    }),
  })
  .required();
