import { PrismaClient, Event, Booking, UserDemo } from "@prisma/client";
import { SearchFilters } from "../controller/eventController";
const prisma = new PrismaClient();

interface SelectedUserData {
  id: number;
  email: string;
  name: string | null;
  isAuthenticated: boolean;
  googleId: string | null;
}

type UserEventsDetails = {
  userData: SelectedUserData[];
  userParticipatedEvents: UserParticipation[];
  organizerEvents: Event[];
};

type UserParticipation = {
  booking: Booking;
};

export class EventModel {
  async findAll(): Promise<Event[]> {
    const eventsWithRelatedInfo = await prisma.event.findMany({
      include: {
        images: true,
      },
    });
    return eventsWithRelatedInfo;
    // return prisma.event.findMany();
  }
  async findAllInDetail(eventId: number): Promise<Event[]> {
    const eventSpeakers = await prisma.eventSpeakerMapping.findMany({
      where: {
        event_id: eventId,
      },
      include: {
        speaker: true,
      },
    });

    console.log("==============eventModel.ts===========");
    console.log(eventSpeakers);

    const eventsWithRelatedInfo = await prisma.event.findMany({
      where: { id: eventId },
      include: {
        organizer: true,
        venue: true,
        category: true,
        type: true,
        images: true,
      },
    });

    const finalReturnData = eventsWithRelatedInfo.map((event) => {
      return {
        ...event,
        speakers: eventSpeakers.map((eventSpeaker) => eventSpeaker.speaker),
      };
    });

    return finalReturnData;
    // return prisma.event.findMany();
  }

  async create(eventData: any): Promise<Event> {
    return prisma.event.create({ data: eventData });
  }
  async updateBasicDetail(eventId: number, updatedEventData: any): Promise<Event | null> {
    try {
      // Fetch the event to verify the organizer_id
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
  
      // Check if the provided organizer_id matches the organizer_id of the event
      if (existingEvent.organizer_id !== updatedEventData.organizer_id) {
        console.error("Organizer ID mismatch");
        return null;
      }
  
      // Proceed with the update
      const updatedEvent = await prisma.event.update({
        where: {
          id: eventId,
        },
        data: updatedEventData,
      });
  
      return updatedEvent;
    } catch (error) {
      // Handle error
      console.error("Error updating event:", error);
      return null;
    }
  }
  
  async deleteEvent(eventId: number, updatedEventData: any): Promise<Event | null> {
    try {
      // Fetch the event to verify the organizer_id
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
  
      // Check if the provided organizer_id matches the organizer_id of the event
      if (existingEvent.organizer_id !== updatedEventData.organizer_id) {
        console.error("Organizer ID mismatch");
        return null;
      }
  
      // Proceed with the update
      const updatedEvent = await prisma.event.delete({
        where: {
          id: eventId,
        }
      });
  
      return updatedEvent;
    } catch (error) {
      // Handle error
      console.error("Error updating event:", error);
      return null;
    }
  }
  
  // async create(eventData: any): Promise<Event> {

  //   const {images, speakers, ...rest } = eventData;

  //   if (!speakers || !Array.isArray(speakers)) {
  //     throw new Error('Invalid speakers data');
  //   }

  //   const formattedEventData = {
  //     ...rest,
  //     speakers: {
  //       connect: speakers.map((speakerId: number) => ({ id: speakerId })),
  //     },
  //     images: {
  //       create: images.map((imageUrl: string) => ({ poster_image: imageUrl })),
  //     },
  //   };
  //   return prisma.event.create({ data: formattedEventData });
  // }

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

  async getUserEventsDetails(userId: number): Promise<UserEventsDetails> {
    const userData = await prisma.userDemo.findMany({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isAuthenticated: true,
        googleId: true,
        profileImage: true,
      },
    });

    const userParticipatedEvents = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: {
          include: {
            venue: true,

            images: true,
          },
        },
      },
    });

    const organizerEvents = await prisma.event.findMany({
      where: {
        organizer_id: userId,
      },
      include: {
        venue: true,

        images: true,
      },
    });

    return {
      userData: userData,
      userParticipatedEvents: userParticipatedEvents.map((booking) => {
        return {
          booking: booking,
        };
      }),
      organizerEvents: organizerEvents,
    };
  }

  async search(searchTerm: string, filters?: SearchFilters): Promise<Event[]> {
    const query = searchTerm;
    
    const filterConditions: any[] = [];

    if (filters?.category) {
      filterConditions.push({
        category_id: parseInt(filters.category),
      });
    }

    if (filters?.type) {
      filterConditions.push({
        type: { contains: filters.type, mode: "insensitive" },
      });
    }

    // if (filters?.startDate && filters?.endDate) {
    //   // Include filter conditions for start and end dates if provided
    //   filterConditions.push({
    //     start_date: { gte: new Date(filters.startDate) },
    //     end_date: { lte: new Date(filters.endDate) },
    //   });
    // }
    if (filters?.startDate && filters?.endDate) {
      // Extract the date part from the provided start and end dates
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
    
      // Extract only the date part
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
      // Include filter conditions for start and end dates
      filterConditions.push({
        // Compare with the start of the provided date (00:00:00)
        start_date: { gte: startDateOnly },
        // Compare with the end of the provided date (23:59:59)
        end_date: { lte: new Date(endDateOnly.getTime() + (24 * 60 * 60 * 1000 - 1)) }, // Add one day and subtract one millisecond
      });
    }
    console.log(filterConditions);

    const events = await prisma.event.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { category: { name: { contains: query, mode: "insensitive" } } },
              { type: { name: { contains: query, mode: "insensitive" } } },
            ],
          },

          ...(filterConditions.length > 0 ? filterConditions : []),
        ],
      },
      include: {
        images: true,
        category: true, // Include the category information
        type: true, // Include the type information
      },
    });
    return events;
  }
}
