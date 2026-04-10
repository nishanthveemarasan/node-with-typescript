import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/auth-helper.ts';
const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try{
        req.user = verifyAccessToken(token);
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({message: "Unauthorized"});
    }
};
export default AuthMiddleware;
