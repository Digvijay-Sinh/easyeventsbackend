import { Request, Response } from "express";
import { EventModel } from "../models/eventModel";

const eventModel = new EventModel();

export class EventController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const events = await eventModel.findAll();
      res.send(events);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      console.log("==============create event model===========");
      console.log(req.body);
      console.log("====================================");
      const newEvent = await eventModel.create(req.body);
      res.json({
        error: false,
        message: "Event added successfully!",
        data: newEvent,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      const event = await eventModel.findById(eventId);
      if (!event) {
        res.status(404).json({ error: true, message: "Event not found" });
        return;
      }
      res.json(event);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      const updatedEvent = await eventModel.update(eventId, req.body);
      res.json({
        error: false,
        message: "Event successfully updated",
        data: updatedEvent,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      await eventModel.remove(eventId);
      res.json({ error: false, message: "Event successfully deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}
