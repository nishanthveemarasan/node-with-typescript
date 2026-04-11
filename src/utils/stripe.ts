import Stripe from "stripe";
import OrderModel from "../models/orderModel.ts";
import type { LineItem, StripeData } from "../types/models.ts";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class StripeService {
  static generatePaymentLink = async (userId: string, orderId: string) => {
    try {
      const orderDetails = await OrderModel.show(userId, orderId);
      const lineItems: LineItem[] = orderDetails.products.map((product) => ({
        price_data: {
          currency: "GBP",
          product_data: {
            name: product.title,
            description: product.description,
          },
          tax_behavior: "exclusive",
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      }));
      const stripeData: StripeData = {
        line_items: lineItems,
        payment_intent_data:{
          metadata: {
            userId: userId,
            orderId: orderId,
          },
        },
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/payment/user/${userId}/order/${orderId}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/user/${userId}/order/${orderId}/cancel`,
      };

      const session = await stripe.checkout.sessions.create(stripeData);
      return session.url;
    } catch (err) {
      console.log("Error generating payment link:", err);
      throw new Error("Failed to generate payment link");
    }
  };
}
export default StripeService;
