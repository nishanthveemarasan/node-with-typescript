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

export interface customError extends Error {
    status?: number;
}


