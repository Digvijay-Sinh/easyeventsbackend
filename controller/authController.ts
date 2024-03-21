import { Request, Response } from "express";
import { PrismaClient, UserDemo } from "@prisma/client";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import { successResponseWithData, errorResponse } from './Responses'; // Import your response helper functions


const prisma = new PrismaClient();

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp, email } = req.body;

    const storedOtp = await prisma.oTP.findFirst({
      where: {
        user: {
          email,
        },
      },
    
      orderBy: { createdAt: 'desc' }

    });

    if (!storedOtp) {
      res
        .status(400)
        .json({ success: false, message: "No OTP found for the user" });
      return;
    }

    if (otp == storedOtp.otp) {
      await prisma.userDemo.update({
        where: {
          id: storedOtp.userId,
        },
        data: {
          isAuthenticated: true,
        },
      });
      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error:", error);

    res.status(500).send("Internal server error");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password, email } = req.body;

    const user = await prisma.userDemo.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
       errorResponse(res, "No user found");
       return
    }

    if (password == user.password) {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.name,
          },
        },
        "processenvACCESSTOKENSECRET",
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        { username: user.name },
        "processenvREFRESHTOKENSECRET",
        { expiresIn: "2d" }
      );
      
      // Saving refreshToken with current user
      // user.refreshToken = refreshToken;
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      await prisma.userDemo.update({
        where: { id: user.id }, // Specify the user by ID
        data: { refreshToken }, // Set the refreshToken field to the new value
      });
      
       successResponseWithData(res, "Login successful",  {accessToken} );
       return
    } else {
       errorResponse(res, "Invalid credentials");
       return
    }
  } catch (error) {
    console.error("Error:", error);
     errorResponse(res, "Internal server error");
     return;
  }
};

// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { password, email } = req.body;

//     const user = await prisma.userDemo.findFirst({
//       where: {
//         email: email,
//       },
//     });
//     console.log("====================================");
//     console.log(user);
//     console.log("====================================");
//     if (!user) {
//       res.status(400).json({ success: false, message: "No user found" });
//       return;
//     }

//     if (password == user.password) {
//       const accessToken = jwt.sign(
//         {
//           UserInfo: {
//             username: user.name,
//           },
//         },
//         "processenvACCESSTOKENSECRET",
//         { expiresIn: "20s" }
//       );
//       const refreshToken = jwt.sign(
//         { username: user.name },
//         "processenvREFRESHTOKENSECRET",
//         { expiresIn: "1m" }
//       );
//       // Saving refreshToken with current user
//       // user.refreshToken = refreshToken;
//       res.cookie("jwt", refreshToken, {
//         httpOnly: true,
//         secure: true,
//         maxAge: 24 * 60 * 60 * 1000,
//       });
//       const userNew = await prisma.userDemo.update({
//         where: { id: user.id }, // Specify the user by ID
//         data: { refreshToken }, // Set the refreshToken field to the new value
//       });
//       res.json({ accessToken });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error("Error:", error);

//     res.status(500).send("Internal server error");
//   }
// };
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const cookies = await req.cookies;
  console.log("====================================");
  console.log(cookies);
  console.log("====================================");
  if (!cookies?.jwt) {
    res.status(401).json({ msg: "Refresh token not available" });
    return;
  }
  const refreshToken = cookies.jwt;

  const foundUser = await prisma.userDemo.findFirst({
    where: { refreshToken },
  });

  if (!foundUser) {
    res.status(403).json({ msg: "User not exists" });
  } //Forbidden

  jwt.verify(
    refreshToken,
    "processenvREFRESHTOKENSECRET",
    (err: any, decoded: any) => {
      if (err || foundUser?.name !== decoded.username)
        return res.sendStatus(403);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
          },
        },
        "processenvACCESSTOKENSECRET",
        { expiresIn: "10s" }
      );
      res.json({ accessToken });
    }
  );
};

export const passwordSetter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, verifyPassword } = req.body;

    const userFromEmail = await prisma.userDemo.findFirst({
      where: {
        email: email,
        isAuthenticated: true,
      },
    });

    if (!userFromEmail) {
      res.status(400).json({ success: false, message: "User does not exists" });
      return;
    }

    if (password == verifyPassword) {
      await prisma.userDemo.update({
        where: {
          id: userFromEmail.id,
        },
        data: {
          password: password,
        },
      });
      res
        .status(200)
        .json({ success: true, message: "Password set successfully" });
    } else {
      res.status(400).json({ success: false, message: "Password set failed" });
    }
  } catch (error) {
    console.error("Error:", error);

    res.status(500).send("Internal server error");
  }
};

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("====================================");
    console.log("reached here");
    console.log("====================================");
    const { email, name } = req.body;

    console.log('====================================');
    console.log(email);
    console.log(name);
    console.log('====================================');

    const existingUser = await prisma.userDemo.findUnique({ where: { email } });
    if (existingUser) {
      console.log("User exists");
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const newUser = await prisma.userDemo.create({
      data: {
        email,
        name,
        isAuthenticated: false,
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "eventmanagment27@gmail.com",
        pass: "awdc gzjp zhac pshc",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const mailOptions = {
      from: "eventmanagment27@gmail.com",
      to: email,
      subject: "OTP from easyevents",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Error sending OTP" });
      } else {
        console.log(`OTP sent to ${email}: ${otp}`);

        await prisma.oTP.upsert({
          where: { id: newUser.id },
          update: { otp, createdAt: new Date() },
          create: { userId: newUser.id, otp },
        });

        res.status(200).json({ message: `OTP sent to ${email}` });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
};
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("====================================");
    console.log("reached here");
    console.log("====================================");
    const { email } = req.body;

    console.log('====================================');
    console.log(email);
    console.log('====================================');

    const newUser = await prisma.userDemo.findUnique({ where: { email } });

    if (!newUser) {
      res.status(400).json({ message: "User does not exists" });
      return;
      
    }

    console.log('=============newUSer============');
    console.log(newUser);
    console.log('===============newUSer===============');
   

    // const newUser = await prisma.userDemo.create({
    //   data: {
    //     email,
    //     isAuthenticated: false,
    //   },
    // });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "eventmanagment27@gmail.com",
        pass: "awdc gzjp zhac pshc",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const mailOptions = {
      from: "eventmanagment27@gmail.com",
      to: email,
      subject: "OTP from easyevents",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending OTP" });
      } else {
        console.log(`OTP sent to ${email}: ${otp}`);
        if (newUser) {
          const latestOTP = await prisma.oTP.findFirst({
            where: { userId: newUser?.id },
            orderBy: { createdAt: 'desc' }
          });
          console.log('=============otpUser==============');
          console.log(latestOTP);
          console.log('===========otpUser=================');
          if (latestOTP) {
            const otpUser = await prisma.oTP.update({
              where: { id: latestOTP.id },
              data: { otp, createdAt: new Date() }
            });
            res.status(200).json({ message: `OTP resent to ${email}` });

          }
          else{
            res.status(500).json({message:"Internal server error"});

          }
        }
        else{
          res.status(500).json({message:"Internal server error"});

        }
   
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({message:"Internal server error"});
  }
};
