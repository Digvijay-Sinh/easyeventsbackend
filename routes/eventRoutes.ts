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
router.get("/search", eventController.search.bind(eventController));
router.get("/paginated", eventController.paginated.bind(eventController));
router.get(
  "/detailed/:id",
  eventController.findAllInDetail.bind(eventController)
);
router.get(
  "/getUserEventsDetails",
  verifyJWT,
  eventController.getUserEventsDetails.bind(eventController)
);
router.get(
  "/getUserEventsDetailsHostedEvents/:id",
  verifyJWT,
  eventController.getUserEventsDetailsHostedEvents.bind(eventController)
);

// Route to create a new event
router.post("/", verifyJWT, eventController.create.bind(eventController));

// Route to retrieve an event by ID
router.get("/:id", eventController.findById.bind(eventController));

// Route to update an event by ID
router.put(
  "/:id",
  verifyJWT,
  eventController.updateBasicDetail.bind(eventController)
);

// Route to delete an event by ID
router.delete(
  "/:id",
  verifyJWT,
  eventController.deleteEvent.bind(eventController)
);

export default router;
