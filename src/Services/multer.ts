import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fileValidation = {
  image: ["image/jpeg", "image/png"],
  file: ["application/pdf"],
};

const fileUpload: any = (customPath = "public", customValidation = []) => {
  const fullPath = path.join(__dirname, `../upload/${customPath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, fullPath);
    },
    filename: (req: any, file: any, cb: any) => {
      const suffixName = nanoid() + file.originalname;
      file.dest = `upload/${customPath}/${suffixName}`;

      cb(null, suffixName);
    },
  });

  interface CustomFile {
    mimetype: string;
  }

  const fileFilter: any = (
    req: Request,
    file: Express.Multer.File,
    cb: any
  ) => {
    const validationList: string[] = customValidation.length
      ? customValidation
      : ["image/jpeg", "image/png"];

    if (validationList.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid format"), false);
    }
  };

  const upload = multer({ fileFilter, storage });

  return upload;
};
export default fileUpload;
