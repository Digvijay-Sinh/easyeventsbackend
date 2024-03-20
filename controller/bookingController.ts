import { Request, Response } from "express";
import { BookingModel } from "../models/bookingModel";

const bookingModel = new BookingModel();

export class BookingController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await bookingModel.findAll();
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const newBooking = await bookingModel.create(req.body);
      res.json({
        error: false,
        message: "Booking added successfully!",
        data: newBooking,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = Number(req.params.id);
      const booking = await bookingModel.findById(bookingId);
      if (!booking) {
        res.status(404).json({ error: true, message: "Booking not found" });
        return;
      }
      res.json(booking);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = Number(req.params.id);
      const updatedBooking = await bookingModel.update(bookingId, req.body);
      res.json({
        error: false,
        message: "Booking successfully updated",
        data: updatedBooking,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = Number(req.params.id);
      await bookingModel.remove(bookingId);
      res.json({ error: false, message: "Booking successfully deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}
