import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import AuthRouter from "./routes/auth-router.ts";
import { NotFound } from "./utils/not-found.ts";
import ApiRouter from "./routes/api-router.ts";
import errorResponseMiddleware from "./middlewares/errorResponseMiddleware.ts";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
const uploadedProductPath = path.join(__dirname, 'public/images/products');

app.use('/images/products',express.static(uploadedProductPath));

app.use(express.json());

app.use("/auth", AuthRouter);

app.use("/api", ApiRouter);

app.use(errorResponseMiddleware);

app.use(NotFound);

export default app;