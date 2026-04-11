import express from "express";
import ProductRouter from "./product-router.ts";
import AuthMiddleware from "../middlewares/authMiddleware.ts";
import OrderRouter from "./order-router.ts";
const router = express.Router();
router.use(AuthMiddleware);
router.use("/products", ProductRouter);
router.use("/orders", OrderRouter);

export default router;