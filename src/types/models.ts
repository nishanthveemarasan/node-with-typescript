export interface IRefreshToken {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface IUserJWT {
    userId: string;
    email: string;
}

export interface IProductUpdateData{
    title: string;
    price: number;
    description: string;
    imageUrl?: string | null;
}

export interface IProduct extends IProductUpdateData{
    id: string;
    userId: string;
}

export interface customError extends Error {
    status?: number;
}

export interface LineItem {
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description: string;
      };
      tax_behavior: "exclusive" | "inclusive" | "unspecified";
      unit_amount: number;
    };
    quantity: number;
  }
  
export interface StripeData {
    line_items: LineItem[];
    payment_intent_data: {
      metadata: {
        userId: string;
        orderId: string;
      };
    };
    mode: "payment" | "setup" | "subscription";
    success_url: string;
    cancel_url: string;
  }


