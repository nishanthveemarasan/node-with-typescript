import type { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import UserModel from '../models/userModel.ts';
import prisma from '../utils/prisma-client.ts';
import { generateAccessToken, generateRefreshToken } from '../utils/auth-helper.ts';
import RefreshTokenModel from '../models/refreshTokenModel.ts';
import type { IRefreshToken } from '../types/models.ts';

class AuthController{
    static register = async (req: Request, res: Response) =>{
        const { name, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 12);

        const user = new UserModel(name, email, hashPassword);
        try{
            await user.save();
            return res.status(201).json({ message: "User registered successfully" });


        }catch(error){
            console.error("Error registering user:", error);
            return res.status(500).json({ message: "Failed to register user" });
        }
    }

    static login = async (req: Request, res: Response) =>{
        try{
            const response:{token?: string, refreshToken?: string, error: boolean} = await prisma.$transaction(async (prisma) => {
                const { username, password } = req.body;
                const user = await UserModel.findByEmail(username);
                if(!user){
                    return {
                        error: true
                    };
                }
                const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
                if(!isPasswordValid){
                 return {
                        error: true
                    };
                }
                const token = generateAccessToken({ userId: user.id, email: user.email });
                const refreshToken = await generateRefreshToken(user.id);
                return { token, refreshToken, error: false };
            });
            if(response.error){
                return res.status(500).json({ message: "Invalid credentials!" });
            }
            return res.status(200).json({ token: response.token, refreshToken: response.refreshToken });
        }catch(error){
            console.error("Error logging in user:", error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }

    static refreshToken = async (req: Request, res: Response) =>{
        try{
            const { refreshToken } = req.body;
            const token: IRefreshToken = await RefreshTokenModel.findByToken(refreshToken);
            const user = await UserModel.findById(token.userId);
            const newRefreshToken = await generateRefreshToken(user.id, refreshToken);
            const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });
            return res.status(200).json({ token: newAccessToken, refreshToken: newRefreshToken });

        }catch(error){
            console.error("Error refreshing token:", error);
            return res.status(500).json({ message: "Something went wrong!" });
        }
    }
}

export default AuthController;