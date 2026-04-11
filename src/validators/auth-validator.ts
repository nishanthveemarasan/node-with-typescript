import { body } from "express-validator";
import UserModel from "../models/userModel.ts";
import RefreshTokenModel from "../models/refreshTokenModel.ts";
export const RegisterInputValidator = [
    body('name', "Name is required!").notEmpty(),
    body('email', "ValidEmail is required!")
        .notEmpty()
        .isEmail()
        .custom(async (value: string) => {
            const user = await UserModel.findByEmail(value);
            if(user){
                throw new Error("Email already in use!");
            }
            return true;
        }),
    body('password', "Password is required!")
        .notEmpty()
        .isLength({ min: 6 })
        .matches(/\d/)
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .custom((value: string, {req}) => {
            if(value !== req.body.password_confirmation){
                throw new Error("Password and Confirm Password must be same!");
            }
            return true;
        })

]

export const LoginValidator = [
    body('username', "ValidEmail is required!")
        .notEmpty()
        .isEmail(),
    body('password', "Password is required!")
        .notEmpty()
]

export const refreshTokenValidator = [
    body("refreshToken", "Refresh token is required")
          .notEmpty()
  ];