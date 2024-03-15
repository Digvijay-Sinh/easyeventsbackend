import { Request, Response } from "express";
import { VenueModel } from "../models/venueModel";

const venueModel = new VenueModel();

export class VenueController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const venues = await venueModel.findAll();
      res.status(200).json(venues);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const newVenue = await venueModel.create(req.body);
      res.json({
        error: false,
        message: "Venue added successfully!",
        data: newVenue,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const venueId = Number(req.params.id);
      const venue = await venueModel.findById(venueId);
      if (!venue) {
        res.status(404).json({ error: true, message: "Venue not found" });
        return;
      }
      res.json(venue);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const venueId = Number(req.params.id);
      const updatedVenue = await venueModel.update(venueId, req.body);
      res.json({
        error: false,
        message: "Venue successfully updated",
        data: updatedVenue,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const venueId = Number(req.params.id);
      await venueModel.remove(venueId);
      res.json({ error: false, message: "Venue successfully deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}
