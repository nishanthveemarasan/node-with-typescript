import { body } from "express-validator";
import type { Request } from "express";
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
                throw Promise.reject("Email already in use!");
            }
            return true;
        }),
    body('password', "Password is required!")
        .notEmpty()
        .isLength({ min: 6 })
        .matches(/\d/)
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .custom((value: string, {req}: {req: Request}) => {
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
          .custom(async(value, { req }) => {
            const activeToken = await RefreshTokenModel.findByToken(value);
            if(!activeToken){
                return Promise.reject('Invalid refresh token');
            }
          })
  ];