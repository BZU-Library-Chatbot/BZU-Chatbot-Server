import { spawn } from "child_process";
import sessionModel from "../../../../DB/model/Session.model.js";
import userModel from "../../../../DB/model/User.model.js";
import interactionModel from "../../../../DB/model/Interaction.model.js";

export const sendMessage = async (req, res, next) => {
  const { message, sessionID } = req.body; // this msg to be sent to chatbot
  const userID = req.user?._id;
  let response;
  let title = "This is a dummy session title for now.";
  if (userID) {
    const user = await userModel.findById(userID);
    if (!user) {
      return next(new Error("user not found", { cause: 404 }));
    }
    req.body.user = user;
  }
  if (sessionID) {
    const session = await sessionModel.findById(sessionID);
    if (!session) {
      return next(new Error("session not found", { cause: 404 }));
    }
    const user = req.body.user;
    if (user) {
      if (session.userID && !session.userID == userID) {
        return next(
          new Error("this user can not access this session", { cause: 400 })
        );
      } else if (!session.userID) {
        session.userID = userID;
        await session.save();
      }
    }
    req.body.session = session;
  } else {
    if (userID) {
      const session = await sessionModel.create({ userID, title });
      req.body.session = session;
    } else {
      const session = await sessionModel.create({ title });
      req.body.session = session;
    }
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
      sessionID: req.body.session._id,
      userID,
    });
    res.json(interaction);
  });
};

export const getAll = async (req, res, next) => {
  const { page = 1, size = 10, sort = "asc" } = req.query;
  const sortOrder = sort === "asc" ? 1 : -1;
  const sessions = await sessionModel
    .find({ userID: req.user._id })
    .skip((page - 1) * size)
    .limit(size)
    .sort({ createdAt: sortOrder });
  const totalSessions = await sessionModel.countDocuments({
    userID: req.user._id,
  });
  const totalPages = Math.ceil((await totalSessions) / size);
  return res.json({ sessions, totalPages, currentPage: page, totalSessions });
};

export const getMessages = async (req, res, next) => {
  const { page = 1, size = 10 } = req.query;
  const { id } = req.params;
  const messages = await interactionModel
    .find({ sessionID: id, userID: req.user._id })
    .skip((page - 1) * size)
    .limit(size);
  const totalMessages = await interactionModel.countDocuments({
    sessionID: id,
    userID: req.user._id,
  });
  const totalPages = Math.ceil(totalMessages / size);
  return res.json({ messages, totalPages, currentPage: page, totalMessages });
};
