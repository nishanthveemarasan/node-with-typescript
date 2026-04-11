import type{ NextFunction, Request, Response } from "express";
import type{ customError } from "../types/models.ts";
import OrderModel from "../models/orderModel.ts";

class OrderController {
    static async addToOrder(req: Request, res: Response, next: NextFunction){
        const {id:productId, action} = req.body;
        try{
            const user = req.user;
             const cartAdded = await OrderModel.addToOrder(user.userId, productId, action);
            if(cartAdded){
                res.status(200).json({ message: `Product is updated to the cart` });
            }else{
                throw new Error('Failed to add product to cart');
            }
    
        }catch(err){
            const error: customError = new Error("Failed to add to order");
            error.status = 500;
            next(error);
        }
    }

    static async show(req: Request, res: Response, next: NextFunction){
        try{
            const {id:orderId} = req.params;
            const user = req.user;
            const {products, totalAmount} = await OrderModel.show(user.userId, orderId as string);
            res.status(200).json({ message: 'Cart fetched', orderDetails: { products, totalAmount } });
        }catch(err){
            const error: customError = new Error("Failed to get order");
            error.status = 500;
            next(error);
        }
       
    }

    static async index(req: Request, res: Response, next: NextFunction){
        try{
            const {page:pageNumber=1} = req.query;
            const user = req.user;
            const data = await OrderModel.index(user.userId, pageNumber as number);
            res.status(200).json({ data });
        }catch(err){
            const error: customError = new Error("Failed to get orders");
            error.status = 500;
            next(error);
        }
       
    }

    static async deleteFromOrder(req: Request, res: Response, next: NextFunction){
        try{
            const user = req.user;
            const {id:productId} = req.params;
           const {products, totalAmount} =  await OrderModel.deleteFromOrder(user.userId, productId as string);
            res.status(200).json({ 
                message: `Product removed from the order successfully`,
                orderDetails: { products, totalAmount }
            });
        }catch(err){
            console.log(err);
            const error: customError = new Error("Failed to delete order");
            error.status = 500;
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction){
        try{
            const user = req.user;
            const {id:orderId} = req.params;
            await OrderModel.delete(orderId as string);
            res.status(200).json({ 
                message: `Order removed successfully`,
            });
        }catch(err){
            console.log(err);
            const error: customError = new Error("Failed to delete order");
            error.status = 500;
            next(error);
        }
    }
}
export default OrderController;