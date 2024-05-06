import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fileValidation: Record<string, string[]> = {
  image: ["image/jpeg", "image/png"],
  file: ["application/pdf"],
};

const fileUpload = (
  customPath: string = "public",
  customValidation: string[] = []
): multer.Multer => {
  const fullPath = path.join(__dirname, `../upload/${customPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req: Express.Request, file: Express.Multer.File, cb: any) => {
      cb(null, fullPath);
    },
    filename: (req: Express.Request, file: Express.Multer.File, cb: any) => {
      const suffixName = nanoid() + path.extname(file.originalname); // Keep file extension
      cb(null, suffixName);
    },
  });

  const fileFilter: multer.Options["fileFilter"] = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const validationList = customValidation.length
      ? customValidation
      : fileValidation.image;

    if (validationList.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid format"));
    }
  };

  const upload = multer({ fileFilter, storage });

  return upload;
};

export default fileUpload;
