import express from "express";
import ProductRouter from "./product-router.ts";

const router = express.Router();

router.use("/products", ProductRouter);

export default router;