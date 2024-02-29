import {Router} from 'express';
import * as AuthController from './controller/Auth.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Auth.validation.js';
const router =Router({caseSensitive:true});

router.post('/signup', validation(validators.signup), asyncHandler(AuthController.signup))
router.post('/login',validation(validators.loginSchema),asyncHandler(AuthController.login))
router.get('/confirmEmail/:token', validation(validators.confirmEmail), asyncHandler(AuthController.confirmEmail))
router.get('/newConfirmEmail/:token', validation(validators.confirmEmail), asyncHandler(AuthController.newConfirmEmail))
router.patch('/sendCode', validation(validators.sendCode), asyncHandler(AuthController.sendCode));
router.patch('/forgetPassword',validation(validators.forgetPassword) ,asyncHandler(AuthController.forgetPassword));
router.post('/refresh', validation(validators.refresh), asyncHandler(AuthController.refreshToken));

export default router;