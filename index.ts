import express, { NextFunction, Request, Response } from "express";
// import userRoutes from "./routes/userRoutes";
import imageUpload from "./routes/imageUpload";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import venueRoutes from "./routes/venueRoutes";
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use(validateRequest)

app.get('/',(req :Request,res:Response)=>{
  res.send("Home page")
})

// app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/imageUpload", imageUpload);
app.use("/api/v1/venue", venueRoutes);

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





app.post('/createEvent', async (req, res) => {
  try {
    // Extract data from the request body
    const { title, description, start_date, end_date, start_date_toRegister, end_date_toRegister, mode, capacity, price, organizer_id, venue_id, category_id, type_id, speakers, images } = req.body;


    const parsedCapacity = parseInt(capacity);
    const parsedPrice = parseFloat(price);
    const parsedOrganizerId = parseInt(organizer_id);
    const parsedVenueId = parseInt(venue_id);
    const parsedCategoryId = parseInt(category_id);
    const parsedTypeId = parseInt(type_id);
    // Create the event in the database using Prisma Client
    const event = await prisma.event.create({
      data: {
        title,
        description,
        start_date,
        end_date,
        start_date_toRegister,
        end_date_toRegister,
        mode,
        capacity: parsedCapacity,
        price: parsedPrice,
        organizer_id: parsedOrganizerId,
        venue_id : parsedVenueId,
        category_id : parsedCategoryId,
        type_id : parsedTypeId,
        speakers: {
          connect: speakers.map((speakerId :number )=> ({ id: speakerId }))
        },
        images: {
          create: images.map((imageUrl: string) => ({  poster_image: imageUrl }))
        }
      },
      include: {
        speakers: true,
        images: true
      }
    });

    // Send the created event as a response
    res.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'An error occurred while creating the event.' });
  }
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
