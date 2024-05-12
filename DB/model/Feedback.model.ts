import mongoose, { Schema, Types, model } from "mongoose";

const feedbackSchema = new Schema(
  {
    text: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    interactionId: {
      type: Types.ObjectId,
      ref: "Interaction",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.virtual("interaction", {
  ref: "Interaction",
  localField: "interactionId",
  foreignField: "_id",
  justOne: true,
});

const feedbackModel =
  mongoose.models.Feedback || model("Feedback", feedbackSchema);
export default feedbackModel;
