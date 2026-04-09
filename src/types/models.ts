export interface IRefreshToken {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
}