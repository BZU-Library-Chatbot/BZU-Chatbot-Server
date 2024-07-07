import feedbackModel from "../../../../DB/model/Feedback.model";
import interactionModel from "../../../../DB/model/Interaction.model";
import { SortOrder } from "mongoose";

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
  const { page = 1, size = 10, sort = "createdAt,desc" } = req.query;
  const sortParams = (sort as string).split(",");
  const sortField = sortParams[0];
  const sortOrder: SortOrder = sortParams[1] === "desc" ? -1 : 1;
  const sortObj: { [key: string]: SortOrder } = {};
  sortObj[sortField] = sortOrder;

  const feedbacks = await feedbackModel
    .find()
    .skip((page - 1) * size)
    .limit(size)
    .sort(sortObj)
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

export const getFeedbackById = async (req: any, res: any, next: any) => {
  const { feedbackId } = req.params;
  const feedback = await feedbackModel
    .findById(feedbackId)
    .populate({
      path: "interactionId",
      populate: {
        path: "userId",
        model: "User",
        select: '-password -forgetCode',
      },

    }).populate({
      path: "text",
      populate: {
        path: "interactionId",
        model: "Interaction",
      },

    })
  return res.status(200).json({
    message: "success",
    feedback,
    
  });

}