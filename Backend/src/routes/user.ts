import express, { Router } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {z} from "zod";
import bcrypt from "bcrypt";
const userRouter=Router();

import { authMiddleware } from "../middleware/auth";


// import dotenv from 'dotenv';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config({ path: 'src/.env' });
console.log(process.env.JWT_SECRET); // Outputs: your-secret-key
const jwtSecret= process.env.JWT_SECRET;
// if (!jwtSecret) {
//   throw new Error("JWT_SECRET is not defined in .env");
// }


import { userModel } from "../db";
import { contentModel } from "../db";

userRouter.post("/signup",async(req,res)=>{
    
    // reciving the input cred in signup
    const{username,password}=req.body;

    const signupSchema=z.object({
        username:z.string().min(8).max(30),
        password:z.string().min(8).max(20)
        .refine(
            function (password){
                return /[a-z]/.test(password);
            },
            {
                message:"Password Must Contain atleast one Lowercase Letter"
            }
        )
        .refine(
            function (password)
            {
                return /[A-Z]/.test(password);
            },
            {
                message:"Password Must Contain At Least One Uppercase Letter"
            }
        )
        .refine(
            function(password)
            {
                return /[0-9]/.test(password);
            },
            {
                message:"Password Must Contain Atleast a Single Number"
            }
        )
        .refine(
            function(password)
            {
                return /[\W_]/.test(password);
            },
            {
                message:"Password Must Contain Atleast one Special Character"
            }
        )
        
    })

    const result=signupSchema.safeParse(req.body);
    if(result.success)
    {   
        const hashedpwd=await bcrypt.hash(password,5);
       try{
        await userModel.create({
            username:username,
            password:hashedpwd
        })

        res.send({
            msg:"Signed in"
        })
       }
       catch(err)
       {
        res.send("Already Exists")
        return;
       }
    }
    else{
        res.send(result.error);
    }
})

userRouter.post("/signin",async(req,res)=>{

    const{username,password}=req.body;
    const response=await userModel.findOne({
        username:username,
    });
    
    console.log(response);

    if(response===null || response.password==null)
    {
        res.status(403).json({
            message:"Inavlid Email Dont Exist"
        })
        return;
    }
    else{
        // Verifying Password
        const result =await bcrypt.compare(password,response.password);
        
        if(result)
        {
            const token=jwt.sign({
                _id:response._id.toString()
            },jwtSecret!);

            res.send({
                token:token
            })
        }
        else{
            res.send({
                Message:"Invalid Password"
            })
        }

        
    }
})


userRouter.post("/content",authMiddleware,async(req,res)=>{
   
    const{link,type,title,tags}=req.body;
    console.log(req.body);
    // @ts-ignore
    // console.log(req.userId);

    try{
        await contentModel.create({
            link:link,
            type:type,
            title:title,
            tags:tags,
            // @ts-ignore
            userId:req.userId
        })

        res.send({
            message:"Content Added Successfully!"
        })
    }
    catch(e)
    {
        res.send({
            message:"Some Parameter is Missing"
        })
    }
})

userRouter.get("/content",authMiddleware,async(req,res)=>{

    // @ts-ignore
    const userId=req.userId
    console.log(userId);
    const response=await contentModel.find({
        userId:userId
    }).populate("userId","username");
    res.send(response);
})


// before deleting any content we have to ensure that the content belongs to the 
// particular perosn only ie and should be authenticated

// ie the userId from the content and the userid of the incoming req 
// should be the same 

userRouter.delete("/remove",authMiddleware,async(req,res)=>{
    const deleteId=req.body.deleteId;
    // @ts-ignore
    const userId=req.userId;

    const response=await contentModel.findOne({
        _id:deleteId
    });
    console.log(response!.userId.toString());
    console.log(userId.toString());
    if(userId===response?.userId.toString())
    {
        const result = await contentModel.findByIdAndDelete(deleteId);
        if(result)
        {
            res.send({
                msg:"Deletion Successfull"
            })
        }
        else{
            res.send({
                msg:"Some Unknown Error on the delete endpoint"
            })
        }
    }
    else{
        res.sendStatus(403)
    }
    
})
export { userRouter };