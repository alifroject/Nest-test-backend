import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


export class ApiTokenCheckMiddleware implements NestMiddleware {
   use(req: Request, res: Response, next: NextFunction) {
       const token = req.headers['x-api-token'];

       if (!token || token !==  process.env.API_TOKEN) {
         return res.status(401).json({message: "Unautherized: invalid API token"})
       }

       next()
   } 
}