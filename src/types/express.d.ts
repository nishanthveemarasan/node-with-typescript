import { IUserJWT } from "./models.ts";

declare global {
    namespace Express {
      interface Request {
        user?: IUserJWT; // Or whatever type verifyAccessToken returns
      }
    }
  }