import { body } from 'express-validator';
import ProductModel from '../models/productModel.ts';
export const addToOrderValidator = [
    body('id')
        .notEmpty()
        .withMessage('Product ID must be an integer')
        .custom(async(value) => {
            const product = await ProductModel.find(value);
            if(!product){
                return new Error('Product  does not exist');
            }
        }),
    body('action')
        .notEmpty()
        .isString()
        .isIn(['add', 'delete'])
        .withMessage('Action must be either increment or decrement'),
]