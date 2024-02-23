import { PrismaClient, UserDemo } from "@prisma/client";
import { Request } from "express";

const prisma = new PrismaClient();

export class UserModel {
  async findAll(): Promise<UserDemo[]> {
    return prisma.userDemo.findMany();
  }

  async create(userData: any): Promise<UserDemo> {
    console.log("==============crate user model===========");
    console.log(userData);
    console.log("====================================");
    return prisma.userDemo.create({ data: userData });
  }

  async findById(userId: number): Promise<UserDemo | null> {
    return prisma.userDemo.findUnique({ where: { id: userId } });
  }
  async findByEmail(email: string): Promise<UserDemo | null> {
    return prisma.userDemo.findUnique({ where: { email: email } });
  }

  async update(userId: number, userData: any): Promise<UserDemo> {
    return prisma.userDemo.update({ where: { id: userId }, data: userData });
  }

  async remove(userId: number): Promise<void> {
    await prisma.userDemo.delete({ where: { id: userId } });
  }
}
