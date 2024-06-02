import sessionModel from "../../../../DB/model/Session.model";
import interactionModel from "../../../../DB/model/Interaction.model";
import axios from "axios";

export const sendMessage = async (req: any, res: any, next: any) => {
  const { message, sessionId } = req.body;
  const userId = req.user?._id;

  let title = "This is a dummy session title for now.";

  const response: any = await axios.post(
    `${process.env.CHATBOT_URL}/webhooks/rest/webhook`,
    { message, sender: sessionId }
  );

  if (response?.status != 200) {
    return next(new Error("Chatbot is not responding"));
  }
  let text = "";
  for (let i = 0; i < response.data.length; i++) {
    if (response.data[i].text) {
      text += response.data[i].text + "\n";
    }
  }
  if (userId) {
    if (sessionId) {
      const session = await sessionModel.findOne({ _id: sessionId, userId });
      req.body.session = session;
      if (!session) {
        const error = new Error("session not found") as any;
        error.cause = 400;
        return next(error);
      }
    } else {
      const session = await sessionModel.create({ userId, title });
      req.body.session = session;
    }
    const interaction = await interactionModel.create({
      message,
      response: text,
      sessionId: req.body.session._id,
      userId,
    });
    await interaction.populate("session");
    res.json(interaction);
  } else {
    const interaction = { message, response: text, session: { title } };
    res.json(interaction);
  }
};

export const getAll = async (req: any, res: any, next: any) => {
  const { page = 1, size = 10 } = req.query;
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
  const session = await sessionModel.find({ _id: id, userId: req.user._id });
  if (!session) {
    const error = new Error("session not found") as any;
    error.cause = 400;
    return next(error);
  }
  const messages = await interactionModel
    .find({ sessionId: id })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ createdAt: -1 });
  const totalMessages = await interactionModel.countDocuments({
    sessionId: id,
  });
  const totalPages = Math.ceil(totalMessages / size);
  messages.reverse();
  return res.json({ messages, totalPages, currentPage: page, totalMessages });
};

export const UpdateSessionTitle = async (req: any, res: any, next: any) => {
  const { id }: any = req.params;
  const userId = req.user._id;

  const session = await sessionModel.findOne({ _id: id, userId });
  if (!session) {
    const error = new Error("Session not found") as any;
    error.cause = 400;
    return next(error);
  }

  const { title }: any = req.body;
  session.title = title;
  session.updatedAt = new Date();
  const updatedSession = await session.save();

  return res
    .status(200)
    .json({ message: "Success", sessionTitle: updatedSession.title });
};
