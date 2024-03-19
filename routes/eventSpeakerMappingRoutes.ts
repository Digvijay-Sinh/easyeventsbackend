import express from "express";
import { EventSpeakerMappingController } from "../controller/eventSpeakerMappingController";

const eventSpeakerMappingController = new EventSpeakerMappingController();
const router = express.Router();

// Route to retrieve all event-speaker mappings

// Route to create a new event-speaker mapping
router.post("/", eventSpeakerMappingController.create.bind(eventSpeakerMappingController));

// Route to retrieve event-speaker mappings by event ID
router.get("/event/:id", eventSpeakerMappingController.findByEventId.bind(eventSpeakerMappingController));

// Additional routes for updating and deleting event-speaker mappings can be added similarly

export default router;
