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
    sessionId: {
      type: Types.ObjectId,
      ref: "Session",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

interactionSchema.virtual("session", {
  ref: "Session",
  localField: "sessionId",
  foreignField: "_id",
  justOne: true,
});

interactionSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const interactionModel =
  mongoose.models.Interaction || model("Interaction", interactionSchema);
export default interactionModel;
