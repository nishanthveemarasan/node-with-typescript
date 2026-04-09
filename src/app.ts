import express from "express";

import AuthRouter from "./routes/auth-router.ts";
import { NotFound } from "./utils/not-found.ts";

const app = express();

app.use(express.json());

app.use("/auth", AuthRouter);

app.use(NotFound);

export default app;