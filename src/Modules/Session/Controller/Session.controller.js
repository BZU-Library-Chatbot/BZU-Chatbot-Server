import { spawn } from "child_process";
import sessionModel from "../../../../DB/model/Session.model.js";
import userModel from "../../../../DB/model/User.model.js";
import interactionModel from "../../../../DB/model/Interaction.model.js";

export const sendMessage = async (req, res, next) => {
  const { message, sessionId } = req.body; 
  const userId = req.user?._id;
  let response;
  let title = "This is a dummy session title for now.";
  
  if (sessionId) {
    const session = await sessionModel.findById(sessionId);
    req.body.session = session;
    if (!session) {
      return next(new Error("session not found", { cause: 404 }));
    }

    if (userId) {
      if (session.userId && !session.userId == userId) {
        return next(
          new Error("this user can not access this session", { cause: 400 })
        );
      } else if (!session.userId) {
        session.userId = userId;
        await session.save();
      }
    }
    
  } else {
      const session = await sessionModel.create({ userId, title });
      req.body.session = session;
  }
  const python = spawn("python3", ["./chatbot.py", message]);
  python.stdout.on("data", (botResponse) => {
    response = botResponse
      .toString()
      .replaceAll("\n", "")
      .replaceAll("\r", "")
      .replaceAll(/\\/g, "");
  });

  python.stderr.on("data", (err) => {});

  python.on("close", async (code) => {
    const interaction = await interactionModel.create({
      message,
      response,
      sessionId: req.body.session._id,
      userId,
    });
    res.json(interaction);
  });
};

export const getAll = async (req, res, next) => {
  const { page = 1, size = 10, sort = "asc" } = req.query;
  const sessions = await sessionModel
    .find({ userId: req.user._id })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ createdAt: -1 });
  const totalSessions = await sessionModel.countDocuments({
    userId: req.user._id,
  });
  const totalPages = Math.ceil((await totalSessions) / size);
  return res.json({ sessions, totalPages, currentPage: page, totalSessions });
};

export const getMessages = async (req, res, next) => {
  const { page = 1, size = 10 } = req.query;
  const { id } = req.params;
  const messages = await interactionModel
    .find({ sessionId: id, userId: req.user._id })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ createdAt: -1 });
  const totalMessages = await interactionModel.countDocuments({
    sessionId: id,
    userId: req.user._id,
  });
  const totalPages = Math.ceil(totalMessages / size);
  return res.json({ messages, totalPages, currentPage: page, totalMessages });
};
