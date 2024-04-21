import multer, { FileFilterCallback, Multer, MulterFile } from "multer";

export const fileValidation = {
  image: ["image/jpeg", "image/png"],
  file: ["application/pdf"],
};

interface CustomFile extends MulterFile {
  mimetype: string;
}

function fileUpload(customValidation: string[] = []): Multer {
  const storage = multer.diskStorage({});

  function fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid format"), false);
    }
  }

  const upload = multer({ fileFilter, storage });
  return upload;
}
export default fileUpload;
