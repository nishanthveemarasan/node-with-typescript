import express from "express";
import AuthController from "../controllers/AuthController.ts";
import { LoginValidator, refreshTokenValidator, RegisterInputValidator } from "../validators/auth-validator.ts";
import ValidationErrorMiddleware from "../middlewares/validationErrorMiddleware.ts";

const router = express.Router();

router.post('/register',RegisterInputValidator, ValidationErrorMiddleware, AuthController.register);
router.post('/login', LoginValidator, ValidationErrorMiddleware, AuthController.login);
router.post('/refresh-token',refreshTokenValidator, ValidationErrorMiddleware, AuthController.refreshToken);
export default router;