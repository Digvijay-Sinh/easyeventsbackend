import { PrismaClient, Event } from "@prisma/client";

const prisma = new PrismaClient();

export class EventModel {
  async findAll(): Promise<Event[]> {
    return prisma.event.findMany();
  }

  async create(eventData: any): Promise<Event> {
    return prisma.event.create({ data: eventData });
  }

  async findById(eventId: number): Promise<Event | null> {
    return prisma.event.findUnique({ where: { eventID: eventId } });
  }

  async update(eventId: number, eventData: any): Promise<Event> {
    return prisma.event.update({
      where: { eventID: eventId },
      data: eventData,
    });
  }

  async remove(eventId: number): Promise<void> {
    await prisma.event.delete({ where: { eventID: eventId } });
  }
}
