import mongoose, { Schema, Types, model } from "mongoose";

const feedbackSchema = new Schema(
  {
    text: {
      type: String,
      required: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    interactionId: {
      type: Types.ObjectId,
      ref: "Interaction",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
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
