import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";

export const profilePic = async (req: any, res: any, next: any) => {
  if (!req.file) {
    const error = new Error("please provide a file") as any;
    error.cause = 400;

    return next(error);
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/user/${req.user.userName}/profile` }
  );
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { profilePic: { secure_url, public_id } },
    { new: false }
  );
  if (user.profilePic) {
    await cloudinary.uploader.destroy(user.profilePic.public_id);
  }
  return res.json({ message: "success" });
};

export const coverPic = async (req: any, res: any, next: any) => {
  if (!req.files) {
    const error = new Error("please provide a file") as any;
    error.cause = 400;

    return next(error);
  }

  const coverPic = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.APP_NAME}/user/${req.user.userName}/cover` }
    );
    interface ImageData {
      secure_url: string;
      public_id: string;
    }

    const coverPic: ImageData[] = [];

    coverPic.push({ secure_url, public_id });
  }
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { coverPic },
    { new: true }
  );
  return res.json({ message: "success", user });
};

export const updatePassword = async (req: any, res: any, next: any) => {
  const { oldPassword, newPassword } = req.body;

  const user = await userModel.findById(req.user._id);
  const match = compare(oldPassword, user.password);
  if (!match) {
    return next(new Error("invalid password "));
  }
  const hashPassword = hash(newPassword);
  await userModel.findByIdAndUpdate(req.user._id, { password: hashPassword });
  return res.json({ message: "success" });
};

export const shareProfile = async (req: any, res: any, next: any) => {
  const user = await userModel
    .findById(req.params.id)
    .select("userName email ");

  if (!user) {
    return next(new Error("invalid profile id"));
  } else {
    return res.json({ message: "success", user });
  }
};

export const makeAdmin = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(
    { id },
    { role: "Admin" },
    { new: true }
  );
  if (!user) {
    const error = new Error("not register account") as any;
    error.cause = 404;

    return next(error);
  }
  return res.status(200).json({ message: "success", user });
};
