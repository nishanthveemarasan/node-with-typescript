import express from 'express';
import { addToOrderValidator } from '../validators/order-validator.ts';
import OrderController from '../controllers/orderController.ts';
import ValidationErrorMiddleware from '../middlewares/validationErrorMiddleware.ts';

const router = express.Router();

router.route('/')
    .get(OrderController.index)
    .post(addToOrderValidator, ValidationErrorMiddleware, OrderController.addToOrder)
router.route('/:id')
    .get(OrderController.show)
    .delete(OrderController.delete)

export default router;