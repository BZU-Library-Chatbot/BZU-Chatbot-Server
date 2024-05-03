import mongoose from "mongoose";
import userModel from "./model/User.model.ts";
import { hash } from "../src/Services/hashAndCompare.ts";

const connectDB = async () => {
  const dbUrl: string = process.env.DB_LOCAL || "";
  return await mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("connect db");
      initializeAdminUser();
    })

    .catch((err) => {
      console.log(`error to connect db ${err}`);
    });
};

const initializeAdminUser = async () => {
  try {
    const existingAdmin = await userModel.findOne({ role: "Admin" });
    if (!existingAdmin) {
      const password: any = process.env.ADMIN_PASSWORD;
      await userModel.create({
        userName: "admin",
        email: process.env.ADMIN_EMAIL,
        password: hash(password),
        role: "Admin",
        confirmEmail: true,
      });
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};
export default connectDB;
