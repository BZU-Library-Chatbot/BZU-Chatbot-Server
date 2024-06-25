import feedbackModel from "../../../../DB/model/Feedback.model";
import interactionModel from "../../../../DB/model/Interaction.model";

export const createFeedback = async (req: any, res: any, next: any) => {
  const { interactionId } = req.params;
  const { text, rating } = req.body;

  const interaction = await interactionModel.findOne({
    _id: interactionId,
    userId: req.user._id,
  });

  if (!interaction) {
    const error = new Error("Interaction not found") as any;
    error.cause = 400;
    return next(error);
  }

  const feedback = await feedbackModel.create({
    interactionId: interactionId,
    text: text,
    rating: rating,
  });

  return res.status(201).json({ message: "success", feedback });
};

export const getAllFeedbacks = async (req: any, res: any, next: any) => {
  const { page = 1, size = 10 } = req.query;
  const feedbacks = await feedbackModel
    .find()
    .skip((page - 1) * size)
    .limit(size)
    .sort({ createdAt: -1 })
    .populate({
      path: "interactionId",
      populate: {
        path: "userId",
        model: "User",
      },
    });

  // return the total number of feedbacks, current page, and the feedbacks
  const totalFeedbacks = await feedbackModel.countDocuments();
  const totalPages = Math.ceil(totalFeedbacks / size);
  return res.status(200).json({
    message: "success",
    feedbacks,
    totalFeedbacks,
    currentPage: Number(page),
    totalPages,
  });
};

export const deleteFeedback = async (req: any, res: any, next: any) => {
  const { feedbackId } = req.params;

  const feedback = await feedbackModel.deleteOne({
    _id: feedbackId,
  });

  if (!feedback) {
    const error = new Error("Feedback not found") as any;
    error.cause = 400;
    return next(error);
  }

  return res.status(200).json({ message: "Feedback deleted successfully" });
};
