import express from "express";
import { SpeakerController } from "../controller/speakerController";
import verifyJWT from "../middleware/middleware";

const speakerController = new SpeakerController();
const router = express.Router();

// Route to retrieve all speakers
router.get("/", speakerController.findAll.bind(speakerController));

// Route to create a new speaker
router.post("/", speakerController.create.bind(speakerController));

// Route to retrieve a speaker by ID
router.get("/:id", speakerController.findById.bind(speakerController));

// Route to update a speaker by ID
router.put("/:id", verifyJWT,speakerController.updateSpeaker.bind(speakerController));

// Route to delete a speaker by ID
router.delete("/:id", speakerController.remove.bind(speakerController));

export default router;
