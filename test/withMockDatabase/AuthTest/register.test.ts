import {beforeEach, describe, expect, test, jest} from '@jest/globals';
import * as AuthHelper from '../../../src/utils/auth-helper.ts';
import prisma from '../../../src/utils/prisma-client.ts';
import request from 'supertest';
import app from '../../../src/app.ts';

jest.mock('../../../src/utils/prisma-client.ts', () => ({
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
    }
}));

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue("mocked-uuid"),
}));

describe.skip("Register User POST auth/register", () => {
    const userData: {name: string, email: string} = {
        name: "John Doe",
        email: "ad@gmail.com"
    }
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should return validation error if no data passed to endpoint', async () => {
        jest.spyOn(AuthHelper, 'hashUserPassword').mockResolvedValueOnce("hashedPassword");
        (prisma.user.create as any).mockResolvedValueOnce({ ...userData, password: "hashedPassword" });

        const result = await request(app)
            .post('/auth/register')
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

    test('should not register user if email is already in use', async () => {
        (prisma.user.findUnique as any).mockResolvedValueOnce({ ...userData, password: "hashedPassword" });
        const result = await request(app)
            .post('/auth/register')
            .set('Accept', 'application/json')
            .send({
               ...userData,
                password: "Password123",
                password_confirmation: "Password123",
            });

        expect(result.status).toBe(422);
        expect(result.body).toHaveProperty("errors");
        expect(result.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                msg: "Email already in use!",
                type: expect.any(String),
                location: expect.any(String),
            }),
        ]));
    });

    test('should register user successfully', async () => {
        jest.spyOn(AuthHelper, 'hashUserPassword').mockResolvedValueOnce("hashedPassword");
        (prisma.user.findUnique as any).mockResolvedValueOnce(null);
        (prisma.user.create as any).mockResolvedValueOnce({ ...userData, password: "hashedPassword" });

        const result = await request(app)
            .post('/auth/register')
            .set('Accept', 'application/json')
            .send({
               ...userData,
                password: "Password123",
                password_confirmation: "Password123",
            });

        expect(result.status).toBe(201);
        expect(result.body).toHaveProperty("message", "User registered successfully");
    })
});