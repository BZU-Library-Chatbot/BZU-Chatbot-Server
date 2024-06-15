import connectDB from "../../DB/connection";
import { globalErrorHandle } from "../Services/errorHandling";
import AuthRouter from "./Auth/Auth.router";
import UserRouter from "./User/User.router";
import SessionRouter from "./Session/Session.router";
import FeedbackRouter from "./Feedback/Feedback.router";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fullPath = path.join(__dirname, "../upload");

const initApp = (app: any, express: any) => {
  app.use(cors());
  connectDB();
  app.use(express.json());
  app.get("/", (req: any, res: any) => {
    return res.send("Welcome to the API Of BZU Library Chatbot");
  });
  app.use("/upload", express.static(fullPath));
  app.use("/auth", AuthRouter);
  app.use("/user", UserRouter);
  app.use("/session", SessionRouter);
  app.use("/feedback", FeedbackRouter);
  app.use("/*", (req: any, res: any, next: any) => {
    const error = new Error("page not found") as any;
    error.cause = 404;

    return next(error);
  });

  //global error handler
  app.use(globalErrorHandle);
};

export default initApp;
