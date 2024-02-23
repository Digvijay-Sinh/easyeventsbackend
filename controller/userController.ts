// import { Request, Response } from 'express';
// import { PrismaClient, UserDemo } from '@prisma/client';

// const prisma = new PrismaClient();

// export const findAll = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const users: UserDemo[] = await prisma.userDemo.findMany();
//         console.log('controller');
//         console.log('res', users);
//         res.send(users);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// };

// export const create = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const new_user = await prisma.userDemo.create({ data: req.body });
//         res.json({ error: false, message: 'User added successfully!', data: new_user });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// };

// export const findById = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const userId = Number(req.params.id);
//         const user = await prisma.userDemo.findUnique({ where: { id: userId } });
//         if (!user) {
//             res.status(404).json({ error: true, message: 'User not found' });
//             return;
//         }
//         res.json(user);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// };

// export const update = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const userId = Number(req.params.id);
//         const updated_user = await prisma.userDemo.update({ where: { id: userId }, data: req.body });
//         res.json({ error: false, message: 'User successfully updated', data: updated_user });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// };

// export const remove = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const userId = Number(req.params.id);
//         await prisma.userDemo.delete({ where: { id: userId } });
//         res.json({ error: false, message: 'User successfully deleted' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// };

import { Request, Response } from "express";
import { UserModel } from "../models/userModel";

const userModel = new UserModel();

export class UserController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userModel.findAll();
      res.send(users);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      console.log("==============crate user model===========");
      console.log(req.body);
      console.log("====================================");
      const newUser = await userModel.create(req.body);
      res.json({
        error: false,
        message: "User added successfully!",
        data: newUser,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const user = await userModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: true, message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
  async findByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      console.log("email", email);
      const user = await userModel.findByEmail(email);
      if (!user) {
        res.status(404).json({ error: true, message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);
      const updatedUser = await userModel.update(userId, req.body);
      res.json({
        error: false,
        message: "User successfully updated",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.id);
      await userModel.remove(userId);
      res.json({ error: false, message: "User successfully deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal server error");
    }
  }
}
