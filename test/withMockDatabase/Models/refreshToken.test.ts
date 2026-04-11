import {beforeEach, describe, expect, test, jest, afterEach} from '@jest/globals';
import RefreshTokenModel from '../../../src/models/refreshTokenModel.ts';
import prisma from '../../../src/utils/prisma-client.ts';

jest.mock('../../../src/utils/prisma-client.ts', () => ({
    refreshToken: {
        create: jest.fn(),
        updateMany: jest.fn(),
        findUnique: jest.fn(),
    },
}));

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue("mocked-uuid"),
}));

describe.skip('RefreshTokenModel', () => {
    let sut: RefreshTokenModel;
    let userId: string = "12345";
    beforeEach(()=> {
        sut = new RefreshTokenModel(userId);
    });

    test('should create a new refresh token and save it to the database', async () => {
        (prisma.refreshToken.create as any).mockResolvedValueOnce({ token: "mocked-uuid"});
        const result = await sut.save();
        expect(result).toBe("mocked-uuid");
       
    });

    test('should expire active tokens for a user', async () => {
        (prisma.refreshToken.updateMany as any).mockResolvedValueOnce({});
        await RefreshTokenModel.expireActiveTokens(userId, "mocked-uuid");
        expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
            where: {
                expiresAt: {
                    gt: expect.any(Date),
                },
                userId,
                token: "mocked-uuid",
            },
            data: {
                expiresAt: expect.any(Date),
            },
        });
    });

    test('should find a refresh token by token string', async () => {
        (prisma.refreshToken.findUnique as any).mockResolvedValueOnce({ token: "mocked-uuid", userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        const result = await RefreshTokenModel.findByToken("mocked-uuid");
        expect(result).toBeDefined();
        expect(result).toEqual(expect.objectContaining({
            token: "mocked-uuid",
            userId: expect.any(String),
        }));
    });
});