import { PrismaClient, Image } from "@prisma/client";

const prisma = new PrismaClient();

export class ImageModel {
  async findAll(): Promise<Image[]> {
    console.log("ImageModel.findAll");
    return prisma.image.findMany();
  }

  async create(imageData: any): Promise<Image> {
    return prisma.image.create({  data: {
        poster_image: imageData.poster_image,
        event: { connect: { id: imageData.eventId } }, // Connect the image to the corresponding event
      },});
  }

  async findById(imageId: number): Promise<Image | null> {
    return prisma.image.findUnique({ where: { id: imageId } });
  }

  async findByEventId(eventId: number): Promise<Image[]> {
    return prisma.image.findMany({
      where: {
        event_id: eventId
      }
    });
  }

  
  async update(imageId: number, imageData: any): Promise<Image> {
    return prisma.image.update({
      where: { id: imageId },
      data: imageData,
    });
  }

  async remove(imageId: number): Promise<void> {
    await prisma.image.delete({ where: { id: imageId } });
  }
}
