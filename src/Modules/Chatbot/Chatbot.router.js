import { Router } from "express";
import { spawn } from 'child_process';
import * as chatbotController from "./Controller/Chatbot.controller.js";
import { asyncHandler } from "../../Services/errorHandling.js";


const router = Router();
router.post("/sendMessage", chatbotController.sendMessage);

export default router;