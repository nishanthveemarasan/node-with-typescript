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