import { v4 as uuidv4 } from "uuid";
import prisma from "../utils/prisma-client.ts";

type IRefreshWhereClause = {
  expiresAt: {
    gt: Date;
  };
  userId?: string;
  token?: string;
};
class RefreshTokenModel {
  static create = async (userId: string) => {
    try {
      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days
      await prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt,
        },
      });
      return token;
    } catch (error) {
      console.error("Error creating refresh token:", error);
      throw new Error("Something went wrong!");
    }
  };

  static expireActiveTokens = async (
    userId: string | null = null,
    token: string | null = null
  ) => {
    try {
      const whereClause: IRefreshWhereClause = {
        expiresAt: {
          gt: new Date(),
        },
      };
      if (userId) {
        whereClause.userId = userId;
      }
      if (token) {
        whereClause.token = token;
      }
      await prisma.refreshToken.updateMany({
        where: whereClause,
        data: {
          expiresAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error expiring refresh tokens:", error);
      throw new Error("Something went wrong!");
    }
  };

  static findByToken = async (token) => {
    try {
      const activeToken = await prisma.refreshToken.findUnique({
        where: {
          token,
          expiresAt: {
            gt: new Date(),
          },
        },
      });
      return activeToken;
    } catch (err) {
      console.error("Error finding refresh token:", err);
      throw new Error("Error finding refresh token");
    }
  };
}

export default RefreshTokenModel;
