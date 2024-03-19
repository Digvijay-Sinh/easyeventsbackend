import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

export class CategoryModel {
  async findAll(): Promise<Category[]> {
    console.log("CategoryModel.findAll");
    
    return prisma.category.findMany({
      include: {
        events: true // Include events related to each category
      }
    });
  }

  async create(categoryData: any): Promise<Category> {
    return prisma.category.create({ data: categoryData });
  }


  async findById(categoryId: number): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id: categoryId } });
  }

  async update(categoryId: number, categoryData: any): Promise<Category> {
    return prisma.category.update({
      where: { id: categoryId },
      data: categoryData,
    });
  }

  async remove(categoryId: number): Promise<void> {
    await prisma.category.delete({ where: { id: categoryId } });
  }

  async updateCategoryImage(categoryId: number, newImageName: string): Promise<Category | null> {
    try {
      // Update the category with the specified id and set the image field to the new image name
      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: { image: newImageName }
      });
      return updatedCategory;
    } catch (error) {
      // Handle errors
      console.error("Error updating category image:", error);
      return null;
    }
  }
}
