import type { Request, Response } from 'express';
import UserModel from '../models/userModel.ts';
import prisma from '../utils/prisma-client.ts';
import { generateAccessToken, generateRefreshToken, hashUserPassword, verifyPassword } from '../utils/auth-helper.ts';
import RefreshTokenModel from '../models/refreshTokenModel.ts';
import type { IRefreshToken, IUser } from '../types/models.ts';

type ILoginResponse = {
    token: string|null;
    refreshToken: string|null;
    error: boolean;
}
class AuthController{
    static register = async (req: Request, res: Response) =>{
        const { name, email, password } = req.body;
        const hashPassword = await hashUserPassword(password);

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
            const response:ILoginResponse = await prisma.$transaction(async (prisma) => {
                const { username, password } = req.body;
                let result:ILoginResponse = {
                    error: false,
                    token: null,
                    refreshToken: null,
                }
                const user: IUser | null = await UserModel.findByEmail(username);
                if(!user){
                    result.error = true;
                    return result;
                }
                const isPasswordValid: boolean = await verifyPassword(password, user.password);
                if(!isPasswordValid){
                    result.error = true;
                    return result;
                }
                const token = generateAccessToken({ userId: user.id, email: user.email });
                const refreshToken = await generateRefreshToken(user.id);
                result = {
                    ...result,
                    token,
                    refreshToken,
                }
                return result;
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
            const token: IRefreshToken|null = await RefreshTokenModel.findByToken(refreshToken);
            if(!token){
                return res.status(422).json({ message: "Invalid refresh token" });
            }
            const user: IUser | null = await UserModel.findById(token.userId);
            if(!user){
                return res.status(401).json({ message: "Invalid request!" });
            }
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