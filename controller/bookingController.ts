import { Request, Response } from "express";
import { BookingModel } from "../models/bookingModel";
import QRCode from "qrcode";

import { CustomRequest } from "../middleware/middleware";
import { EventModel } from "../models/eventModel";
const bookingModel = new BookingModel();
const eventModel = new EventModel();

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

  async create(req: CustomRequest, res: Response): Promise<void> {
    try {
      const generateQRCode = async (text: string, filepath: string) => {
        try {
          await QRCode.toFile(filepath, text, {
            color: {
              dark: "#FFF", // Blue dots
              light: "#0000", // Transparent background
            },
          });
          console.log("QR code generated successfully");
        } catch (err) {
          console.error(err);
        }
      };

      const text = JSON.stringify(req.body);

      const userId = req.user;
      console.log("========fsdfsdfdsfsdfsdds===============");
      console.log(userId);
      console.log("====================================");
      const fileName = `${userId ? userId + Date.now() : "no"}.png`;

      const eventById = await eventModel.findById(req.body.eventId);
      if (
        eventById &&
        eventById?.tickets_remaining < req.body.numberOfTickets
      ) {
        res.status(500).json({
          message: "Cannot book ticket for this event. Tickets are sold out!",
        });
        return;
      }

      await generateQRCode(text, `uploads/${fileName}`);

      const newBooking = await bookingModel.create({
        ...req.body,
        userId: userId,
        qrCodeImageUrl: fileName,
      });

      const updatedevent = await eventModel.update(req.body.eventId, {
        tickets_remaining: eventById
          ? eventById?.tickets_remaining - req.body.numberOfTickets
          : 0,
      });

      res.json({
        error: false,
        message: "Booking added successfully!",
        data: newBooking,
      });
    } catch (error) {
      console.log("Error:", error);
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
