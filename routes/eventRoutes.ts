import express from "express";
import { EventController } from "../controller/eventController";
import verifyJWT from "../middleware/middleware";

const eventController = new EventController();
const router = express.Router();

// Route to retrieve all events
//v1
// router.get("/",verifyJWT, eventController.findAll.bind(eventController));


//v2
router.get("/", eventController.findAll.bind(eventController));

// Route to create a new event
router.post("/", eventController.create.bind(eventController));

// Route to retrieve an event by ID
router.get("/:id", eventController.findById.bind(eventController));

// Route to update an event by ID
router.put("/:id", eventController.update.bind(eventController));

// Route to delete an event by ID
router.delete("/:id", eventController.remove.bind(eventController));

export default router;
