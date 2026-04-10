import type{ IProductUpdateData } from "../types/models.ts";
import prisma from "../utils/prisma-client.ts";
interface IProductModel{
    title: string;
    price: number;
    description: string;
    imageUrl: string | null;
}
class ProductModel implements IProductModel{
    title: string;
    price: number;
    description: string;
    imageUrl: string | null;

    constructor(title: string, price: number, description: string, imageUrl: string | null) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    async save(userId: string) {
        try{
            const product = await prisma.product.create({
                data: {
                    title: this.title,
                    price: this.price,
                    description: this.description,
                    user:{
                        connect: {id: userId}
                    }
                },
              });
              if(this.imageUrl){
                await prisma.file.create({
                    data: {
                        url: this.imageUrl,
                        product: {
                            connect: {id: product.id}
                        }
                    }
                });
              }
              return product;
        }catch(error){
            console.error("Error saving product:", error);
            throw new Error("Failed to save product");
        }
    }

    static async index(userId: string, pageNumber: number = 1) {
        try {
            const limmit = 25;
            const offset = (pageNumber - 1) * limmit;
            const products = await prisma.product.findMany({
              where: {
                  userId: userId
              },
              include:{
                  file: {
                      select: {
                          url: true
                      }
                  }
              },
              skip: offset,
              take: limmit,
      
            });
            return products;
          } catch (err) {
            console.error("Error fetching products:", err);
            throw new Error("Failed to fetch products");
          }
    }

    static async find(id: string) {
        try {
            const product = await prisma.product.findUnique({
              where: {
                  id: id
              }
            });
            return product;
          } catch (err) {
            console.error("Error finding product by ID:", err);
            throw new Error("Failed to find product");
          }
    }

    static async update(userId: string, productId: string, updatedData: IProductUpdateData) {
        try {
          console.log("Updating product with data:", updatedData);
          const result = await prisma.product.update({
            where: {
                id: productId,
                userId: userId
            },
            data: {
                title: updatedData.title,
                price: updatedData.price,
                description: updatedData.description,
            }
          });
          if(updatedData.imageUrl){
            const existingFile = await prisma.file.findUnique({
                where: {
                    productId: productId
                }
            });
            if(existingFile){
                await prisma.file.update({
                    where: {
                        id: existingFile.id
                    },
                    data: {
                        url: updatedData.imageUrl
                    }
                });
            }
          }
          return result;
        } catch (err) {
          console.error("Error updating product:", err);
          throw new Error("Failed to update product");
        }
    }

    static async delete(userId: string, productId: string) {
        try {
          const result = await prisma.product.delete({
            where: {
                id: productId,
                userId: userId
            }
          });
          return result;
        } catch (err) {
          console.error("Error deleting product:", err);
          throw new Error("Failed to delete product");
        }
    }
}
export default ProductModel;