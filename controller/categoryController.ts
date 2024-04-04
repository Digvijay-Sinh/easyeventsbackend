import { Request, Response } from "express";
import { CategoryModel } from "../models/categoryModel";
import { logger } from "..";

const categoryModel = new CategoryModel();

export class CategoryController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoryModel.findAll();

      logger.info(categories)
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const newCategory = await categoryModel.create(req.body);
      res.json({
        error: false,
        message: "Category added successfully!",
        data: newCategory,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async updateCategoryImage(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, newImageName } = req.body;
  
      // Ensure categoryId and newImageName are provided
      if (!categoryId || !newImageName) {
        res.status(400).json({
          error: true,
          message: "Both categoryId and newImageName are required fields.",
        });
        return;
      }
  
      // Update the category image
      const updatedCategory = await categoryModel.updateCategoryImage(categoryId, newImageName);
  
      if (updatedCategory) {
        res.json({
          error: false,
          message: "Category image updated successfully!",
          data: updatedCategory,
        });
      } else {
        res.status(404).json({
          error: true,
          message: `Category with id ${categoryId} not found.`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = Number(req.params.id);
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        res.status(404).json({ error: true, message: "Category not found" });
        return;
      }
      res.json(category);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = Number(req.params.id);
      const updatedCategory = await categoryModel.update(categoryId, req.body);
      res.json({
        error: false,
        message: "Category successfully updated",
        data: updatedCategory,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = Number(req.params.id);
      await categoryModel.remove(categoryId);
      res.json({ error: false, message: "Category successfully deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}
