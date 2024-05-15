import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import initApp from "./src/Modules/app.router";

const app: any = express();
const PORT = process.env.PORT || 3000;

initApp(app, express);

const server = app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
export default server;
