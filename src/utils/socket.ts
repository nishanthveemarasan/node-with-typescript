import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import type{ IProduct } from "../types/models.ts";

interface ProductChangedPayload {
    product: IProduct; 
  }

interface ServerToClientEvents {
    notification: (message: string) => void;
    product_changed: (payload: ProductChangedPayload) => void;
  }
  
  interface ClientToServerEvents {
    hello: (msg: string) => void;
  }

let io: Server<ClientToServerEvents, ServerToClientEvents> | null = null;;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"]
        }
    });
    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};