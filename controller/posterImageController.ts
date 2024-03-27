import { Request, Response } from "express";
import { ImageModel } from "../models/posterImageModel";
import { CustomRequest } from "../middleware/middleware";

const imageModel = new ImageModel();



export class ImageController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const images = await imageModel.findAll();
      res.status(200).json(images);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
        const {eventId, filename} = req.body;
      const newImage = await imageModel.create({eventId,poster_image:filename});
      res.json({
        error: false,
        message: "Image added successfully!",
        data: newImage,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  async updatePosterImage(req: CustomRequest, res: Response): Promise<void> {
    try {

      const userId = req?.user as string;
        const {eventId, filename} = req.body;
      const newImage = await imageModel.updatePoster(
        {eventId,poster_image:filename, userId: parseInt(userId)});
      res.json({
        error: false,
        message: "Image added successfully!",
        data: newImage,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }


  async findById(req: Request, res: Response): Promise<void> {
    try {
      const imageId = Number(req.params.id);
      const image = await imageModel.findById(imageId);
      if (!image) {
        res.status(404).json({ error: true, message: "Image not found" });
        return;
      }
      res.json(image);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const imageId = Number(req.params.id);
      const updatedImage = await imageModel.update(imageId, req.body);
      res.json({
        error: false,
        message: "Image successfully updated",
        data: updatedImage,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const imageId = Number(req.params.id);
      await imageModel.remove(imageId);
      res.json({ error: false, message: "Image successfully deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}
