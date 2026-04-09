import prisma from "../utils/prisma-client.ts";
interface IUserModel {
    id?: string;
    name: string;
    email: string;
    password: string;
    save: () => Promise<Object>;
}
class UserModel implements IUserModel{
    name: string;
    email: string;
    password: string;
    constructor(name: string, email: string, password: string){
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async save() {
        try{
            const user = await prisma.user.create({
                data: this
            });
            return user;

        }catch(error){
            console.error("Error saving user:", error);
            throw new Error("Failed to save user");
        }
    }

    static async findByEmail(email: string) {
        try{
            const user = await prisma.user.findUnique({
                where: { email }
            });
            return user;

        }catch(error){
            console.error("Error finding user by email:", error);
            throw new Error("Something went wrong!");
        }
    }

    static async findById(id: string) {
        try{
            const user = await prisma.user.findUnique({
                where: { id }
            });
            return user;

        }catch(error){
            console.error("Error finding user by id:", error);
            throw new Error("Something went wrong!");
        }
    }
}

export default UserModel;