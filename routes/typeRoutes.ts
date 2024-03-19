import express from "express";
import { TypeController } from "../controller/typeController";

const typeController = new TypeController();
const router = express.Router();

// Route to retrieve all types
router.get("/", typeController.findAll.bind(typeController));

// Route to create a new type
router.post("/", typeController.create.bind(typeController));

// Route to retrieve a type by ID
router.get("/:id", typeController.findById.bind(typeController));

// Route to update a type by ID
router.put("/:id", typeController.update.bind(typeController));

// Route to delete a type by ID
router.delete("/:id", typeController.remove.bind(typeController));

export default router;
