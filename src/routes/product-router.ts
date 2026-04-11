import express

from "express";
import type { Request } from "express"
import multer from 'multer';
import ProductController from "../controllers/productController.ts";
import ValidationErrorMiddleware from "../middlewares/validationErrorMiddleware.ts";
import { updateProductValidator, createProductValidator } from "../validators/product-validator.ts";

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images/products/');
  },
  filename: (req :Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
    storage: fileStorage,
    fileFilter: (req: Request, file:Express.Multer.File, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
 });

 router.route('/')
    .post(
        upload.single('image'),
        createProductValidator,
        ValidationErrorMiddleware,
        ProductController.create
    )
    .get(ProductController.index);

router.route('/:id')
    .get(ProductController.show)
    .patch(
        upload.single('image'),
        updateProductValidator,
        ValidationErrorMiddleware,
        ProductController.update
    )
    .delete(ProductController.delete);




export default router;