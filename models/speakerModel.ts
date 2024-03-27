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

  async updateSpeaker(speakerId: number, speakerData: any): Promise<Speaker | null> {
    try {
      // Find the event associated with the speaker
      const eventSpeakerMappingData = await prisma.eventSpeakerMapping.findFirst({
        where: {
          speaker_id: speakerId,
        },
       
      });

      if (!eventSpeakerMappingData) {
        console.error("EventSpeakerMapping not found");
          return null
      }
      const eventFromSpeaker = await prisma.event.findFirst({
        where: {
          id: eventSpeakerMappingData.event_id,
        },
       
      });
  
      // If no eventSpeakerMapping found, return null
      if (!eventFromSpeaker) {
        console.error("Event From Speaker not found");
        return null;
      }
  
      // Check if the organizer_id of the event matches the organizer_id provided in the speakerData
      if (eventFromSpeaker.organizer_id !== speakerData.organizer_id) {
        console.error("Organizer ID mismatch");
        return null;
      }

      const {organizer_id, ...speakerDataWithoutOrganizerId} = speakerData;
  
      // Update the speaker
      const updatedSpeaker = await prisma.speaker.update({
        where: { id: speakerId },
        data: speakerDataWithoutOrganizerId,
      });
  
      return updatedSpeaker;
    } catch (error) {
      console.error("Error updating speaker:", error);
      return null;
    }
  }
  

  async remove(speakerId: number): Promise<void> {
    await prisma.speaker.delete({ where: { id: speakerId } });
  }
}
