import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {z} from "zod";
import { Router } from "express";

import {userRouter} from "./routes/user";




async function ConnectDB()
{
    try{
        await mongoose.connect("mongodb+srv://Jayshende:S12Ce8MKll5AtCPl@cluster0.i3qcn.mongodb.net/Second-brain-app");
        console.log("Connected to the Database");
    }
    catch(e){
        console.log("Unable To Connect to the Database");
    }
}
ConnectDB();

const app=express();

app.use(express.json());
app.use("/api/v1",userRouter);

app.listen(3000);

