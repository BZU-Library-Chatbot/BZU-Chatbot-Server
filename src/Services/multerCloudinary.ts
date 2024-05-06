import multer, { Multer } from "multer";

export const fileValidation = {
  image: ["image/jpeg", "image/png"],
  file: ["application/pdf"],
};

function fileUpload(customValidation: string[] = []): Multer {
  const storage = multer.diskStorage({});
  const fileFilter: any = (
    req: Request,
    file: Express.Multer.File,
    cb: any
  ) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid format"), false);
    }
  };

  const upload = multer({ fileFilter, storage });
  return upload;
}
export default fileUpload;
