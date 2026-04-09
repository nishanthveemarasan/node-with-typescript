import jwt from "jsonwebtoken";
import { env } from "prisma/config";
import RefreshTokenModel from "../models/refreshTokenModel.ts";
type IUser = {
    userId: string;
    email: string;
}
export const generateAccessToken = (user: IUser) => {
    const token = jwt.sign(user, env("JWT_SECRET"), { expiresIn: "1h" });
    return token;
}  

export const generateRefreshToken = async(userId: string, activeToken: string|null=null) => {
    try{
        await RefreshTokenModel.expireActiveTokens(userId, activeToken);
        const refreshToken = await RefreshTokenModel.create(userId);
        return refreshToken;

    }catch(error){
        console.error("Error generating refresh token:", error);
        throw new Error("Something went wrong!");
    }
}