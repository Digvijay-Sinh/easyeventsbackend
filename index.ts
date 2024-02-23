import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import verifyJWT from "./middleware/middleware";
import cors from "cors";
import session, { Session } from "express-session";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

import { PrismaClient, UserDemo } from "@prisma/client";

const prisma = new PrismaClient();
declare module "express-session" {
  interface SessionData {
    otp: number;
    email: string;
  }
}

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }, // Set secure cookie for HTTPS
  })
);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", verifyJWT, eventRoutes);
app.use("/api/v1/auth", authRoutes);

app.post("/api/v1/register", (req: Request, res: Response) => {
  const { firstname, lastname, email } = req.body;

  if (!firstname || !lastname || !email) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  res
    .status(200)
    .json({ success: true, message: "User registered successfully" });
});

// Middleware function to decode and verify JWT token
// app.post("/api/protected", authenticateToken, (req: Request, res: Response) => {
//   res.json({
//     message: `Welcome This is a protected route. ${req.body.isAuthenticated}`,
//   });
// });

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
