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
  async updatePoster(imageData: any): Promise<Image |  null> {
    const eventId= imageData.eventId;
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        organizer_id: true,
      },
    });

    if (!existingEvent) {
      console.error("Event not found");
      return null;
    }
    console.log('====================================');
    console.log(existingEvent.organizer_id);
    console.log('====================================');
    console.log('====================================');
    console.log(imageData.userId);
    console.log('====================================');

    // Check if the provided organizer_id matches the organizer_id of the event
    if (existingEvent.organizer_id !== imageData.userId) {
      console.error("Organizer ID mismatch");
      return null;
    }
    await prisma.image.updateMany(
      { where: { event_id: imageData.eventId } ,
        data: {
          poster_image: imageData.poster_image,
        },
      });
      return prisma.image.findFirst({
        where: {
          event_id: imageData.eventId,
        },
      });
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
