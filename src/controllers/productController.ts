import type { NextFunction, Request, Response } from "express";
import type{ customError, IProductUpdateData } from "../types/models.ts";
import ProductModel from "../models/productModel.ts";
class ProductController {
    static async create(req: Request, res: Response, next: NextFunction){
        try{
            const {title, price, description} = req.body;
            console.log(req.file);
            const imageUrl = req.file ? req.file.path : null;
            const user = req.user;
            if(!imageUrl){
                const error: customError = new Error('Image is required');
                error.status = 422; 
                next(error);
            }
            const product = new ProductModel(
                title,
                parseFloat(price),
                description,
                imageUrl
             );
             const result = await product.save(user.userId);
             res.status(201).json({ message: 'Product created', result });
        }catch(error){
            const err: customError = new Error("Failed to create product");
            err.status = 500;
            next(error);
        }
    }
    static async index(req: Request, res: Response, next: NextFunction){
        try{
            const {page:pageNumber=1} = req.query;
            const user = req.user;
            const products = await ProductModel.index(user.userId, parseInt(pageNumber as string));
            res.status(200).json({products});

        }catch(error){
            const err: customError = new Error("Failed to get All products");
            err.status = 500;
            next(error);
        }
    }
    static async show(req: Request, res: Response, next: NextFunction){
        try{
            const {id:productId} = req.params;
            const user = req.user;
            const product = await ProductModel.find(productId as string);
              if (product) {
                res.status(200).json({ message: 'Product fetched', product: product });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }

        }catch(error){
            const err: customError = new Error("Failed to get a product");
            err.status = 500;
            next(error);
        }
    }
    static async update(req: Request, res: Response, next: NextFunction){
        try{
            const {id:productId} = req.params;
            const {title, price, description} = req.body;
            const imageUrl = req.file ? req.file.path : null;
            console.log(imageUrl);

            const user = req.user;
            const editData: IProductUpdateData = {
                title,
                price: parseFloat(price),
                description
            }
            if(imageUrl){
                editData.imageUrl = imageUrl;
            }
            const updatedProduct = await ProductModel.update(user.userId, productId as string, editData);
            if (!updatedProduct) {
               return res.status(404).json({ message: 'Product not found' });
           }
           res.status(200).json({ message: 'Product updated', updatedProduct });
       

        }catch(error){
            const err: customError = new Error("Failed to update a product");
            err.status = 500;
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction){
        try{

        }catch(error){
            const err: customError = new Error("Failed to delete a product");
            err.status = 500;
            next(error);
        }
    }

}

export default ProductController;