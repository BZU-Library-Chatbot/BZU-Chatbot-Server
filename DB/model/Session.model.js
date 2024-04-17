import mongoose, { Schema, Types, model } from "mongoose";

const sessionSchema = new Schema(
  {
    title: {
      type: String,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const sessionModel = mongoose.models.Session || model("Session", sessionSchema);
export default sessionModel;
