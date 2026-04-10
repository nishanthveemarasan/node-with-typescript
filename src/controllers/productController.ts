import type { NextFunction, Request, Response } from "express";
import type{ customError } from "../types/models.ts";
class ProductController {
    static async create(req: Request, res: Response, next: NextFunction){
        try{
            const {title, price, description} = req.body;
            console.log(req.file);
            const imageUrl = req.file ? req.file.path : null;
            if(!imageUrl){
                const error: customError = new Error('Image is required');
                error.status = 422; 
                next(error);
            }
            console.log(imageUrl);
        }catch(error){
            const err: customError = new Error("Failed to create product");
            err.status = 500;
            next(error);
        }
    }
    static async index(req: Request, res: Response, next: NextFunction){
        try{

        }catch(error){
            const err: customError = new Error("Failed to get All products");
            err.status = 500;
            next(error);
        }
    }
    static async show(req: Request, res: Response, next: NextFunction){
        try{

        }catch(error){
            const err: customError = new Error("Failed to get a product");
            err.status = 500;
            next(error);
        }
    }
    static async update(req: Request, res: Response, next: NextFunction){
        try{

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