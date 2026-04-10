import express from "express";
import ProductRouter from "./product-router.ts";
import AuthMiddleware from "../middlewares/authMiddleware.ts";

const router = express.Router();
router.use(AuthMiddleware);
router.use("/products", ProductRouter);

export default router;