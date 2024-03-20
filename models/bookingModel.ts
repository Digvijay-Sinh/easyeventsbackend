import { PrismaClient, Booking } from "@prisma/client";

const prisma = new PrismaClient();

export class BookingModel {
  async findAll(): Promise<Booking[]> {
    console.log("BookingModel.findAll");
    return prisma.booking.findMany();
  }

  async create(bookingData: any): Promise<Booking> {
    return prisma.booking.create({ data: bookingData });
  }

  async findById(bookingId: number): Promise<Booking | null> {
    return prisma.booking.findUnique({ where: { id: bookingId } });
  }

  async update(bookingId: number, bookingData: any): Promise<Booking> {
    return prisma.booking.update({
      where: { id: bookingId },
      data: bookingData,
    });
  }

  async remove(bookingId: number): Promise<void> {
    await prisma.booking.delete({ where: { id: bookingId } });
  }
}
