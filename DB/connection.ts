import mongoose from "mongoose";

const connectDB = async () => {
  const dbUrl : string = process.env.DB_LOCAL || "";
  return await mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("connect db");
    })
    .catch((err) => {
      console.log(`error to connect db ${err}`);
    });
};

export default connectDB;
