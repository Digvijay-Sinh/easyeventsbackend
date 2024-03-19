import { Request, Response } from "express";
import { SpeakerModel } from "../models/speakerModel";
import { EventSpeakerMappingModel } from "../models/eventSpeakerMappingModel";
import { log } from "console";

const speakerModel = new SpeakerModel();
const eventSpeakerMappingModel = new EventSpeakerMappingModel();


export class SpeakerController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const speakers = await speakerModel.findAll();
      res.status(200).json(speakers);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { eventId, speakerData } = req.body;

      console.log("==============create speaker model===========");
        console.log(req.body);
        console.log('====================================');
        console.log(speakerData);
        console.log('====================================');
      
      
      // Create the speaker
      const newSpeaker = await speakerModel.create(speakerData);
      
      // Obtain the speakerId of the newly created speaker
      const speakerId = newSpeaker.id;
  
      // Now, create an entry in the EventSpeakerMapping table
      const newMapping = await eventSpeakerMappingModel.create(eventId, speakerId);
  
      res.json({
        error: false,
        message: "Speaker and Event-Speaker Mapping added successfully!",
        data: { speaker: newSpeaker, mapping: newMapping },
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const speakerId = Number(req.params.id);
      const speaker = await speakerModel.findById(speakerId);
      if (!speaker) {
        res.status(404).json({ error: true, message: "Speaker not found" });
        return;
      }
      res.json(speaker);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const speakerId = Number(req.params.id);
      const updatedSpeaker = await speakerModel.update(speakerId, req.body);
      res.json({
        error: false,
        message: "Speaker successfully updated",
        data: updatedSpeaker,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const speakerId = Number(req.params.id);
      await speakerModel.remove(speakerId);
      res.json({ error: false, message: "Speaker successfully deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}
