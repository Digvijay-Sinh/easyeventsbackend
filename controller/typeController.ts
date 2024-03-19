import { Request, Response } from "express";
import { TypeModel } from "../models/typeModel";

const typeModel = new TypeModel();

export class TypeController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const types = await typeModel.findAll();
      res.status(200).json(types);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const newType = await typeModel.create(req.body);
      res.json({
        error: false,
        message: "Type added successfully!",
        data: newType,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const typeId = Number(req.params.id);
      const type = await typeModel.findById(typeId);
      if (!type) {
        res.status(404).json({ error: true, message: "Type not found" });
        return;
      }
      res.json(type);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const typeId = Number(req.params.id);
      const updatedType = await typeModel.update(typeId, req.body);
      res.json({
        error: false,
        message: "Type successfully updated",
        data: updatedType,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const typeId = Number(req.params.id);
      await typeModel.remove(typeId);
      res.json({ error: false, message: "Type successfully deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}
