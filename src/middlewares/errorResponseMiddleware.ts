import type{ ErrorRequestHandler } from "express";

const errorResponseMiddleware: ErrorRequestHandler = (err, req, res, ext) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
}
export default errorResponseMiddleware;