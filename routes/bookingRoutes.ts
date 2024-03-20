import express from "express";
import { BookingController } from "../controller/bookingController";

const bookingController = new BookingController();
const router = express.Router();

// Route to retrieve all bookings
router.get("/", bookingController.findAll.bind(bookingController));

// Route to create a new booking
router.post("/", bookingController.create.bind(bookingController));

// Route to retrieve a booking by ID
router.get("/:id", bookingController.findById.bind(bookingController));

// Route to update a booking by ID
router.put("/:id", bookingController.update.bind(bookingController));

// Route to delete a booking by ID
router.delete("/:id", bookingController.remove.bind(bookingController));

export default router;
