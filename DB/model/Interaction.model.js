import mongoose, { Schema, Types, model } from "mongoose";

const interactionSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    sessionID: {
      type: Types.ObjectId,
      ref: "Session",
      required: true,
    },
    userID: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const interactionModel =
  mongoose.models.Interaction || model("Interaction", interactionSchema);
export default interactionModel;
