import { OrderTrackStatus } from "../../generated/prisma/enums.ts";
import prisma from "../utils/prisma-client.ts";

class OrderModel {
    static async addToOrder(userId: string, productId: string, action: 'add' | 'delete') {
        try{
            const result = await prisma.$transaction(async (prisma) => {
                let getOrder = await prisma.order.findFirst({
                    where: {
                        userId: userId,
                        currentStatus: 'CREATED',
                        deletedAt: null
                    },
                });
                if (!getOrder) {
                    getOrder = await prisma.order.create({
                        data: {
                            userId: userId,
                            totalAmount: 0,
                            deletedAt: null
                        },
                    });
                    await prisma.orderStatus.create({
                        data: {
                            orderId: getOrder.id,
                            status: "CREATED",
                        },
                    });
                }
                const existingOrderItem = await prisma.orderItem.findUnique({
                    where: {
                        orderId_productId: {
                            orderId: getOrder.id,
                            productId: productId,
                        },
                    },
                });
                if (action === 'add') {
                    if (existingOrderItem) {
                        await prisma.orderItem.update({
                            where: { id: existingOrderItem.id },
                            data: { qty: {increment:1} },
                        });
                    } else {
                        await prisma.orderItem.create({
                            data: {
                                orderId: getOrder.id,
                                productId: productId,
                                qty: 1,
                            },
                        });
                    }   
                }else if (action === 'delete') {
                    if (!existingOrderItem) throw new Error("Item not in cart");
                    if (existingOrderItem.qty > 1) {
                        await prisma.orderItem.update({
                            where: { id: existingOrderItem.id },
                            data: { qty: { decrement: 1 } }
                        });
                    } else {
                        await prisma.orderItem.delete({
                            where: { id: existingOrderItem.id }
                        });
                    }
                }

                const allItems = await prisma.orderItem.findMany({
                    where: { orderId: getOrder.id },
                    include: {
                        product: {
                            select: {
                                price: true,
                            },
                        },
                    },
                });
                const totalAmount = allItems.reduce((total, item) => total + item.qty * item.product.price, 0);
                await prisma.order.update({
                    where: { id: getOrder.id },
                    data: { totalAmount },
                });
            });
            return true;

        }catch(err){
            console.log(err);
            throw new Error("Failed to add product to order");
        }
    }

    static async index(userId: string, pageNumber: number = 1) {
        try{
            const limit = 25;
            const offset = (pageNumber - 1) * limit;
            const orders = await prisma.order.findMany({
                where: {
                    userId,
                    deletedAt: null
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: { file: true }
                            }
                        }
                    }
                },
                skip: offset,
                take: limit,
            });
            return orders;
        }catch(err){
            console.log(err);
            throw new Error("Failed to get order details");
        }
    }

    static async show(userId: string, orderId: string) {
        try{
            let condition: {
                userId: string;
                id: string;
            } = {
                userId: userId,
                id: orderId
            }
            const order = await prisma.order.findFirst({
                where: condition,
                include: {
                    items: {
                        include: {
                            product: {
                                include: { file: true } 
                            }
                        }
                    }
                }
            });
            if (!order) {
                throw new Error("Failed to get order details");
            }
            const products = order.items.map(item => ({
                ...item.product,
                quantity: item.qty
            }));
            return {products, totalAmount: order.totalAmount};
        }catch(err){
            console.log(err);
            throw new Error("Failed to get order details");
        }
    }

    static async deleteFromOrder(userId: string, productId: string) {
        try{
            const result = await prisma.$transaction(async (prisma) => {
                 let getOrder = await prisma.order.findFirst({
                    where: {
                        userId: userId,
                        currentStatus: 'CREATED',
                        deletedAt: null
                    },
                });
                 if (!getOrder) {
                    return {products: [], totalAmount: 0};
                }
                const existingOrderItem = await prisma.orderItem.findUnique({
                    where: {
                        orderId_productId: {
                            orderId: getOrder.id,
                            productId: productId,
                        },
                    },
                });
                if (!existingOrderItem) {
                   await this.delete(getOrder.id);
                    return {products: [], totalAmount: 0};
                }
                await prisma.orderItem.delete({
                    where: { id: existingOrderItem.id }
                });

                const allItems = await prisma.orderItem.findMany({
                    where: { orderId: getOrder.id },
                    include: {
                        product: {
                            include: { 
                                file: true 
                            }
                        },
                    },
                });
                if (allItems.length === 0) {
                   await this.delete(getOrder.id);
                    return {products: [], totalAmount: 0};
                }else{
                    const products = allItems.map(item => ({
                        ...item.product,
                        quantity: item.qty
                    }));
                    const totalAmount = allItems.reduce((total, item)  => total + item.qty * item.product.price, 0);
                    await prisma.order.update({
                        where: { id: getOrder.id },
                        data: { totalAmount },
                    });
                    return {products, totalAmount};
                }
            });
            console.log("Order after deletion:", result);
                return result;
        }catch(err){
            console.log(err);
            throw new Error("Failed to remove product from the order");
        }

    }
    static async delete(id: string) {
        try{
            await prisma.order.update({
                where: { id },
                data:{
                    deletedAt: new Date()
                },
            });
            return true;
        }catch(err){
            console.log(err);
            throw new Error("Failed to delete order");
        }
    }

    static updatePaymentStatus = async (userId: string, orderId: string, status: OrderTrackStatus) => {
        console.log("Updating payment status for orderId:", orderId, "to status:", status);
        try{
            const result = await prisma.$transaction(async (prisma) => {
                const order = await prisma.order.findFirst({
                    where: {
                        id: orderId,
                        userId: userId,
                    },
                });
                if (!order) {
                    throw new Error("Order not found");
                }
               await prisma.order.update({
                    where: { id: orderId },
                    data: { currentStatus: status },
                });

                await prisma.orderStatus.create({
                    data: {
                        orderId: orderId,
                        status: status,
                    },
                });
            });
            return true;
        }catch(err){
            console.log(err);
            throw new Error("Failed to update payment status");
        }
    }

}
export default OrderModel;