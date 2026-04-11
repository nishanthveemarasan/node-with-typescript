import {beforeEach, describe, expect, test, jest} from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app.ts';
import prisma from '../../../src/utils/prisma-client.ts';
import * as AuthHelper from '../../../src/utils/auth-helper.ts';
import RefreshTokenModel from '../../../src/models/refreshTokenModel.ts';

jest.mock('../../../src/utils/prisma-client.ts', () => ({
    refreshToken: {
        findUnique: jest.fn(),
    },
    user:{
        findUnique: jest.fn(),
    }
}));

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue("mocked-uuid"),
}));

describe("Refresh Token POST auth/refresh-token", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    let token = "mocked-refresh-token";
    const userId = "user-id";
    test('should return validation error if no data passed to endpoint', async () => {
        const result = await request(app)
            .post('/auth/refresh-token')
            .set('Accept', 'application/json')
            .send({});
        expect(result.status).toBe(422);
        expect(result.body).toHaveProperty("errors");
        expect(result.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                msg: "Refresh token is required",
                type: expect.any(String),
                location: expect.any(String),
            }),
        ]));
    });

    test('should return error if invalid refresh token passed', async () => {
        (prisma.refreshToken.findUnique as any).mockResolvedValueOnce(null);
        const result = await request(app)
            .post('/auth/refresh-token')
            .set('Accept', 'application/json')
            .send({
                refreshToken: token,
            });
        expect(result.status).toBe(422);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe("Invalid refresh token");
    });

    test('should return new access token and refresh token if valid refresh token passed', async () => {
        (prisma.refreshToken.findUnique as any).mockResolvedValueOnce({
            id:"12344",
            token,
            userId,
            expiresAt: new Date(Date.now() + 10000),
            createdAt: new Date(Date.now() + 10000),
        });
        (prisma.user.findUnique as any).mockResolvedValueOnce({
            id: userId,
            name: "Test User",
            email: "ad@gmail.com",
            password: "Password123",
        });
        
        jest.spyOn(AuthHelper, 'generateAccessToken').mockReturnValueOnce("mocked-access-token");
        jest.spyOn(AuthHelper, 'generateRefreshToken').mockResolvedValueOnce("new-mocked-refresh-token");
        const result = await request(app)
            .post('/auth/refresh-token')
            .set('Accept', 'application/json')
            .send({
                refreshToken: token,
            });
        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("token");
        expect(result.body).toHaveProperty("refreshToken");
        expect(result.body.token).toBe("mocked-access-token");
        expect(result.body.refreshToken).toBe("new-mocked-refresh-token");
    });
});