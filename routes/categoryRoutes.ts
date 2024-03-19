import express from "express";
import { CategoryController } from "../controller/categoryController";

const categoryController = new CategoryController();
const router = express.Router();

// Route to retrieve all categories
router.get("/", categoryController.findAll.bind(categoryController));

// Route to create a new category
router.post("/", categoryController.create.bind(categoryController));
router.post("/updateImage", categoryController.updateCategoryImage.bind(categoryController));

// Route to retrieve a category by ID
router.get("/:id", categoryController.findById.bind(categoryController));

// Route to update a category by ID
router.put("/:id", categoryController.update.bind(categoryController));

// Route to delete a category by ID
router.delete("/:id", categoryController.remove.bind(categoryController));

export default router;
