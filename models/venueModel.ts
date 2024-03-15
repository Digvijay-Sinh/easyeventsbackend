import { PrismaClient, Venue } from "@prisma/client";

const prisma = new PrismaClient();

export class VenueModel {
  async findAll(): Promise<Venue[]> {
    console.log("VenueModel.findAll");
    
    return prisma.venue.findMany();
  }

  async create(venueData: any): Promise<Venue> {
    return prisma.venue.create({ data: venueData });
  }

  async findById(venueId: number): Promise<Venue | null> {
    return prisma.venue.findUnique({ where: { id: venueId } });
  }

  async update(venueId: number, venueData: any): Promise<Venue> {
    return prisma.venue.update({
      where: { id: venueId },
      data: venueData,
    });
  }

  async remove(venueId: number): Promise<void> {
    await prisma.venue.delete({ where: { id: venueId } });
  }
}
