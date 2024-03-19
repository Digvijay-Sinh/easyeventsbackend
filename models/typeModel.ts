import { PrismaClient, Type } from "@prisma/client";

const prisma = new PrismaClient();

export class TypeModel {
  async findAll(): Promise<Type[]> {
    console.log("TypeModel.findAll");
    return prisma.type.findMany();
  }

  async create(typeData: any): Promise<Type> {
    return prisma.type.create({ data: typeData });
  }

  async findById(typeId: number): Promise<Type | null> {
    return prisma.type.findUnique({ where: { id: typeId } });
  }

  async update(typeId: number, typeData: any): Promise<Type> {
    return prisma.type.update({
      where: { id: typeId },
      data: typeData,
    });
  }

  async remove(typeId: number): Promise<void> {
    await prisma.type.delete({ where: { id: typeId } });
  }
}
