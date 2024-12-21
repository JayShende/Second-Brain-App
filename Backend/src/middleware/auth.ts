import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
dotenv.config({ path: 'src/.env' });
const JWT_SECRET= process.env.JWT_SECRET;


export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const token=req.headers.authorization;
    // console.log(token);
    try{
        const decode=jwt.verify(token!,JWT_SECRET!);
        // console.log(decode);
        // @ts-ignore
        req.userId=decode._id;
        next();
    }
    catch(e){
        res.sendStatus(403)
    }
}