import jwt from "jsonwebtoken";
import { env } from "prisma/config";
import bcrypt from "bcryptjs";
import RefreshTokenModel from "../models/refreshTokenModel.ts";
import { v4 as uuidv4 } from "uuid";
import type{ IUserJWT } from "../types/models.ts";

export const generateAccessToken = (user: IUserJWT): string => {
    const token = jwt.sign(user, env("JWT_SECRET"), { expiresIn: "1h" });
    return token;
}  

export const generateRefreshToken = async(userId: string, activeToken: string|null=null) => {
    try{
        await RefreshTokenModel.expireActiveTokens(userId, activeToken);
        const refreshToken = new RefreshTokenModel(userId);
        const token = await refreshToken.save();
        return token;

    }catch(error){
        console.error("Error generating refresh token:", error);
        throw new Error("Something went wrong!");
    }
}

export const hashUserPassword = async(password: string): Promise<string> => {
    const hashPassword = await bcrypt.hash(password, 12);
    return hashPassword;
}

export const generateRefreshTokenString = (): string => {
    return uuidv4();
}

export const verifyPassword = async(password: string, hashPassword: string): Promise<boolean> => {
    const isPasswordValid: boolean = await bcrypt.compare(password, hashPassword);
    return isPasswordValid;
}

export const verifyAccessToken = (token: string): IUserJWT => {
    try{
        const decoded  = jwt.verify(token, env("JWT_SECRET")) as IUserJWT;
        return decoded;
    }catch(error){
        console.error("Error verifying access token:", error);
        throw new Error("Invalid token");
    }
}