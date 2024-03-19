import { Router } from "express";
import { spawn } from 'child_process';
import * as sessionController from "./Controller/Session.controller.js";
import validation from "../../Middleware/validation.js";
import * as validators from "./Session.valdation.js";
import { asyncHandler } from "../../Services/errorHandling.js";

const router = Router();
router.post("/message", validation(validators.sendMessage), (sessionController.sendMessage));

export default router;