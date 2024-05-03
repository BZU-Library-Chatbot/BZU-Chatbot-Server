import { spawn } from "child_process";
import sessionModel from "../../../../DB/model/Session.model.ts";
import userModel from "../../../../DB/model/User.model.ts";
import interactionModel from "../../../../DB/model/Interaction.model.ts";

export const sendMessage = async (req: any, res: any, next: any) => {
  const { message, sessionId } = req.body;
  const userId = req.user?._id;
  let response: any;
  let title = "This is a dummy session title for now.";

  if (sessionId) {
    const session = await sessionModel.findById(sessionId);
    req.body.session = session;
    if (!session) {
      const error = new Error("session not found") as any;
      error.cause = 404;

      return next(error);
    }

    if (userId) {
      if (session.userId && !session.userId == userId) {
        return next(new Error("this user can not access this session"));
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
    await interaction.populate("session");
    res.json(interaction);
  });
};

export const getAll = async (req: any, res: any, next: any) => {
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

export const getMessages = async (req: any, res: any, next: any) => {
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
  messages.reverse();
  return res.json({ messages, totalPages, currentPage: page, totalMessages });
};
