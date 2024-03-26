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

    if (filters?.startDate && filters?.endDate) {
      // Include filter conditions for start and end dates if provided
      filterConditions.push({
        start_date: { gte: new Date(filters.startDate) },
        end_date: { lte: new Date(filters.endDate) },
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

          ...filterConditions,
        ],
      },
      include: {
        category: true, // Include the category information
        type: true, // Include the type information
      },
    });
    return events;
  }
}
