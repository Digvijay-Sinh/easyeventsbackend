import express, { NextFunction, Request, Response } from "express";


const jwt = require("jsonwebtoken");

export interface CustomRequest extends Request {
  user?: string; // Define the custom 'user' property
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  console.log('====================================');
  console.log("Verifying JWT");
  console.log('====================================');
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as string;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  console.log(token);
  jwt.verify(token, "processenvACCESSTOKENSECRET", (err: any, decoded: any) => {
    if (err) return res.sendStatus(403); //invalid token
    req.user = decoded.UserInfo.userId;
    console.log('============req.user============');
    console.log(req.user);
    console.log('====================================');
    next();
  });
};

export default verifyJWT;
