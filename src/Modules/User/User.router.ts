import { Router } from "express";
import * as userController from "./Controller/User.controller.ts";
import { auth, roles } from "../../Middleware/auth.middleware.ts";
import { asyncHandler } from "../../Services/errorHandling.ts";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.ts";
import validation from "../../Middleware/validation.ts";
import * as validators from "./User.validation.ts";
const router = Router();

router.patch(
  "/profilePic",
  auth(),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.profilePic),
  asyncHandler(userController.profilePic)
);

router.patch(
  "/coverPic",
  auth(),
  fileUpload(fileValidation.image).array("image", 4),
  validation(validators.coverPic),
  asyncHandler(userController.coverPic)
);

router.patch(
  "/makeAdmin/:id",
  auth([roles.Admin]),
  validation(validators.makeAdmin),
  asyncHandler(userController.makeAdmin)
);

router.patch(
  "/updatePassword",
  auth(),
  validation(validators.updatePassword),
  asyncHandler(userController.updatePassword)
);

router.get(
  "/:id/profile",
  validation(validators.shareProfile),
  asyncHandler(userController.shareProfile)
);
export default router;
