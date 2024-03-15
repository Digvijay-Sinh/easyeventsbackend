import express from "express";
import { VenueController } from "../controller/venueController";

const venueController = new VenueController();
const router = express.Router();

// Route to retrieve all venues
router.get("/", venueController.findAll.bind(venueController));

// Route to create a new venue
router.post("/", venueController.create.bind(venueController));

// Route to retrieve a venue by ID
router.get("/:id", venueController.findById.bind(venueController));

// Route to update a venue by ID
router.put("/:id", venueController.update.bind(venueController));

// Route to delete a venue by ID
router.delete("/:id", venueController.remove.bind(venueController));

export default router;
