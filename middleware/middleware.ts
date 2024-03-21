import express, { NextFunction, Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";

// interface AuthenticatedRequest extends Request {
//   user?: any; // Define the user property as optional
// }
// export const authenticateToken = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;
//   var authToken = "";
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     authToken = authHeader.split(" ")[1];
//   }

//   const secretKey = "secret";

//   jwt.verify(authToken, secretKey, (err, decoded) => {
//     if (err) {
//       console.error("Error decrypting token:", err.message);
//       return;
//     }
//     req.body.isAuthenticated = true;
//     console.log("Decrypted token:", decoded as JwtPayload);
//     next();
//   });
// };

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
