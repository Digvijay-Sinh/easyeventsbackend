import { Request, Response } from "express";
import { EventSpeakerMappingModel } from "../models/eventSpeakerMappingModel";

const eventSpeakerMappingModel = new EventSpeakerMappingModel();

export class EventSpeakerMappingController {
  

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { eventId, speakerId } = req.body;
      const newMapping = await eventSpeakerMappingModel.create(eventId, speakerId);
      res.json({
        error: false,
        message: "Event-Speaker Mapping added successfully!",
        data: newMapping,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async findByEventId(req: Request, res: Response): Promise<void> {
    try {
      const eventId = Number(req.params.id);
      const mappings = await eventSpeakerMappingModel.findByEventId(eventId);
      res.json(mappings);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }


  async create111(){
   
  }

  // Additional methods for updating and removing mappings can be implemented similarly
}
