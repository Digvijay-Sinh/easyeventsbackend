import { PrismaClient, Event } from "@prisma/client";

const prisma = new PrismaClient();

export class EventModel {
  async findAll(): Promise<Event[]> {
    return prisma.event.findMany();
  }

    async create(eventData: any): Promise<Event> {

      const {images, speakers, ...rest } = eventData;

      if (!speakers || !Array.isArray(speakers)) {
        throw new Error('Invalid speakers data');
      }
    
      const formattedEventData = {
        ...rest,
        speakers: {
          connect: speakers.map((speakerId: number) => ({ id: speakerId })),
        },
        images: {
          create: images.map((imageUrl: string) => ({ poster_image: imageUrl })),
        },
      };
      return prisma.event.create({ data: formattedEventData });
    }

  async findById(eventId: number): Promise<Event | null> {
    return prisma.event.findUnique({ where: { id: eventId } });
  }

  async update(eventId: number, eventData: any): Promise<Event> {
    return prisma.event.update({
      where: { id: eventId },
      data: eventData,
    });
  }

  async remove(eventId: number): Promise<void> {
    await prisma.event.delete({ where: { id: eventId } });
  }
}
