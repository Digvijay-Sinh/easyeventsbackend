import express, { NextFunction, Request, Response } from "express";
// import userRoutes from "./routes/userRoutes";
import imageUpload from "./routes/imageUpload";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import venueRoutes from "./routes/venueRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import typeRoutes from "./routes/typeRoutes";
import eventSpeakerMappingRoutes from "./routes/eventSpeakerMappingRoutes";
import speakerRoutes from "./routes/speakerRoutes";
import posterImage from "./routes/posterImageRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import qrcodeRoutes from "./routes/qrcodeRoutes";
import verifyJWT from "./middleware/middleware";
import cors from "cors";
import session, { Session } from "express-session";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

import { PrismaClient } from "@prisma/client";
import validateRequest from "./middleware/validatorMiddleware";
import path from "path";
import { number, string } from "joi";

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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use(validateRequest)

app.get("/", (req: Request, res: Response) => {
  res.send("Home page");
});

// app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/imageUpload", imageUpload);
app.use("/api/v1/venue", venueRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/types", typeRoutes);
app.use("/api/v1/eventSpeakerMapping", eventSpeakerMappingRoutes);
app.use("/api/v1/speakers", speakerRoutes);
app.use("/api/v1/posterImage", posterImage);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/qrcode", qrcodeRoutes);

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


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
