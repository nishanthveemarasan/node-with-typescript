import {beforeEach, describe, expect, test, jest} from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app.ts';
import prisma from '../../../src/utils/prisma-client.ts';
import * as AuthHelper from '../../../src/utils/auth-helper.ts';

jest.mock('../../../src/utils/prisma-client.ts', () => ({
    user: {
        findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
}));

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue("mocked-uuid"),
}));
describe.skip("Login User POST auth/login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    let userData: {id: string, email: string, password: string} = {
        id: "user-id",
        email: "ad@gmail.com",
        password: "Password123",
    }

    test('should return validation error if no data passed to endpoint', async () => {
        (prisma.$transaction as any).mockImplementation(async (cb: any) => cb(prisma));
        (prisma.user.findUnique as any).mockResolvedValueOnce({...userData});
        jest.spyOn(AuthHelper, 'verifyPassword').mockResolvedValueOnce(true);
        jest.spyOn(AuthHelper, 'generateAccessToken').mockReturnValueOnce("mocked-access-token");
        jest.spyOn(AuthHelper, 'generateRefreshToken').mockResolvedValueOnce("mocked-refresh-token");
        const result = await request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send();

        expect(result.status).toBe(422);
        expect(result.body).toHaveProperty("errors");
        expect(result.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                msg: expect.any(String),
                type: expect.any(String),
                location: expect.any(String),
            }),
        ]));
    });

    test('should return error if user not found', async () => {
        (prisma.$transaction as any).mockImplementation(async (cb: any) => cb(prisma));
        (prisma.user.findUnique as any).mockResolvedValueOnce(null);
        const result = await request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send({
                username: userData.email,
                password: userData.password,
            });
        expect(result.status).toBe(500);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe("Invalid credentials!");
    });

    test('should return error if password is invalid', async () => {
        (prisma.$transaction as any).mockImplementation(async (cb: any) => cb(prisma));
        (prisma.user.findUnique as any).mockResolvedValueOnce({...userData});
        jest.spyOn(AuthHelper, 'verifyPassword').mockResolvedValueOnce(false);
        const result = await request(app)
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send({
                username: userData.email,
                password: userData.password,
            });
        expect(result.status).toBe(500);
        expect(result.body).toHaveProperty("message");
        expect(result.body.message).toBe("Invalid credentials!");
    });

        test('should login user successfully', async () => {
            (prisma.$transaction as any).mockImplementation(async (cb: any) => cb(prisma));
            (prisma.user.findUnique as any).mockResolvedValueOnce({...userData});
            jest.spyOn(AuthHelper, 'verifyPassword').mockResolvedValueOnce(true);
            jest.spyOn(AuthHelper, 'generateAccessToken').mockReturnValueOnce("mocked-access-token");
            jest.spyOn(AuthHelper, 'generateRefreshToken').mockResolvedValueOnce("mocked-refresh-token");
            const result = await request(app)
                .post('/auth/login')
                .set('Accept', 'application/json')
                .send({
                    username: userData.email,
                    password: userData.password,
                });
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty("token");
            expect(result.body).toHaveProperty("refreshToken");
            expect(result.body).toEqual(expect.objectContaining({
                token: expect.any(String),
                refreshToken: expect.any(String),
            }));
            expect(result.body.token).toBe("mocked-access-token");
            expect(result.body.refreshToken).toBe("mocked-refresh-token");
        });
});