import {beforeEach, describe, expect, test, jest, afterEach} from '@jest/globals';

import UserModel from '../../../src/models/userModel.ts';
import prisma from '../../../src/utils/prisma-client.ts';

jest.mock('../../../src/utils/prisma-client.ts', () => ({
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
    }
}));

describe.skip("UserModel", () => {
    let sut: UserModel;
    beforeEach(() => {
        sut = new UserModel("John Doe", "ad@gmail.com", "hashedPassword");
    })

    test("should create a new user and save it to the database", async () => {
        (prisma.user.create as any).mockResolvedValueOnce({ name: "John Doe", email: "ad@gmail.com", password: "hashedPassword" });
        const ressult =await sut.save();
        expect(ressult).toBeDefined();
        expect(ressult).toHaveProperty("name");
    });

    test("should find a user by email", async () => {
       (prisma.user.findUnique as any).mockResolvedValueOnce({ name: "John Doe", email: "ad@gmail.com", password: "hashedPassword" });
        const result = await UserModel.findByEmail("ad@gmail.com");
        expect(result).toBeDefined();
        expect(result).toEqual(expect.objectContaining({
            name: expect.any(String),
        }));
    });
    test("test should find a user by id", async () => {
        (prisma.user.findUnique as any).mockResolvedValueOnce({ id:"1",name: "John Doe", email: "ad@gmail.com", password: "hashedPassword" });
        const result = await UserModel.findById("1");
        expect(result).toBeDefined();
        expect(result).toEqual(expect.objectContaining({
            name: expect.any(String),
        }));
    })
});