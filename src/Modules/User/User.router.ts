import { Router } from "express";
import * as userController from "./Controller/User.controller";
import { auth, roles } from "../../Middleware/auth.middleware";
import { asyncHandler } from "../../Services/errorHandling";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary";
import validation from "../../Middleware/validation";
import * as validators from "./User.validation";
const router = Router();

router.patch(
  "/profile",
  auth(),
  fileUpload(fileValidation.image).single("file"),
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
  "/profile",
  auth(),
  validation(validators.getProfile),
  asyncHandler(userController.getProfile)
);
export default router;
