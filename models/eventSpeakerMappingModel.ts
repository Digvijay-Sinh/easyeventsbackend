import { PrismaClient, EventSpeakerMapping } from "@prisma/client";

const prisma = new PrismaClient();

export class EventSpeakerMappingModel {
  async create(eventId: number, speakerId: number): Promise<EventSpeakerMapping> {
    return prisma.eventSpeakerMapping.create({
      data: {
        event: { connect: { id: eventId } },
        speaker: { connect: { id: speakerId } }
      }
    });
  }

  async findByEventId(eventId: number): Promise<EventSpeakerMapping[]> {
    return prisma.eventSpeakerMapping.findMany({
      where: { event_id: eventId }
    });
  }
}
