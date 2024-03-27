import express from "express";
import { ImageController } from "../controller/posterImageController";
import verifyJWT from "../middleware/middleware";

const imageController = new ImageController();
const router = express.Router();

// Route to retrieve all images
router.get("/", imageController.findAll.bind(imageController));

// Route to create a new image
router.post("/", imageController.create.bind(imageController));

// Route to retrieve an image by ID
router.get("/:id", imageController.findById.bind(imageController));

// Route to update an image by ID
router.put("/", verifyJWT ,imageController.updatePosterImage.bind(imageController));

// Route to delete an image by ID
router.delete("/:id", imageController.remove.bind(imageController));

export default router;
