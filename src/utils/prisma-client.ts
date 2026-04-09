import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.ts";
import { env } from "prisma/config";
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: env("MONGO_CONNECT")
      }),
});

export default prisma;