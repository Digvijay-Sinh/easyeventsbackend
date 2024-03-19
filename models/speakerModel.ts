import { PrismaClient, Speaker } from "@prisma/client";

const prisma = new PrismaClient();

export class SpeakerModel {
  async findAll(): Promise<Speaker[]> {
    return prisma.speaker.findMany();
  }

  async create(speakerData: any): Promise<Speaker> {
    return prisma.speaker.create({ data: speakerData });
  }

  async findById(speakerId: number): Promise<Speaker | null> {
    return prisma.speaker.findUnique({ where: { id: speakerId } });
  }

  async update(speakerId: number, speakerData: any): Promise<Speaker> {
    return prisma.speaker.update({
      where: { id: speakerId },
      data: speakerData,
    });
  }

  async remove(speakerId: number): Promise<void> {
    await prisma.speaker.delete({ where: { id: speakerId } });
  }
}
