import express, { Router } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
const userRouter = Router();

import { authMiddleware } from "../middleware/auth";

// import dotenv from 'dotenv';
import dotenv from "dotenv";
// Load environment variables
dotenv.config({ path: "src/.env" });
// console.log(process.env.JWT_SECRET); // Outputs: your-secret-key
const jwtSecret = process.env.JWT_SECRET;
// if (!jwtSecret) {
//   throw new Error("JWT_SECRET is not defined in .env");
// }

import { linkModel, userModel } from "../db";
import { contentModel } from "../db";
import { random } from "../utils";

userRouter.post("/signup", async (req, res) => {
  // reciving the input cred in signup
  const { username, password } = req.body;

  const signupSchema = z.object({
    username: z.string().min(8).max(30),
    password: z
      .string()
      .min(8)
      .max(20)
      .refine(
        function (password) {
          return /[a-z]/.test(password);
        },
        {
          message: "Password Must Contain atleast one Lowercase Letter",
        }
      )
      .refine(
        function (password) {
          return /[A-Z]/.test(password);
        },
        {
          message: "Password Must Contain At Least One Uppercase Letter",
        }
      )
      .refine(
        function (password) {
          return /[0-9]/.test(password);
        },
        {
          message: "Password Must Contain Atleast a Single Number",
        }
      )
      .refine(
        function (password) {
          return /[\W_]/.test(password);
        },
        {
          message: "Password Must Contain Atleast one Special Character",
        }
      ),
  });

  const result = signupSchema.safeParse(req.body);
  if (result.success) {
    const hashedpwd = await bcrypt.hash(password, 5);
    try {
      await userModel.create({
        username: username,
        password: hashedpwd,
      });

      res.send({
        msg: "Signed in",
      });
    } catch (err) {
      res.send("Already Exists");
      return;
    }
  } else {
    res.send(result.error);
  }
});

userRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const response = await userModel.findOne({
    username: username,
  });

  console.log(response);

  if (response === null || response.password == null) {
    res.status(403).json({
      message: "Inavlid Email Dont Exist",
    });
    return;
  } else {
    // Verifying Password
    const result = await bcrypt.compare(password, response.password);

    if (result) {
      const token = jwt.sign(
        {
          _id: response._id.toString(),
        },
        jwtSecret!
      );

      res.send({
        token: token,
      });
    } else {
      res.send({
        Message: "Invalid Password",
      });
    }
  }
});

userRouter.post("/content", authMiddleware, async (req, res) => {
  const { link, type, title, tags } = req.body;
  // console.log(req.body);
  // @ts-ignore
  // console.log(req.userId);

  try {
    await contentModel.create({
      link: link,
      type: type,
      title: title,
      // @ts-ignore
      userId: req.userId,
    });

    res.send({
      message: "Content Added Successfully!",
    });
  } catch (e) {
    res.send({
      message: "Some Parameter is Missing",
    });
  }
});

userRouter.get("/content", authMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  // console.log(userId);
  const response = await contentModel
    .find({
      userId: userId,
    })
    .populate("userId", "username");
  res.send(response);
});

// before deleting any content we have to ensure that the content belongs to the
// particular perosn only ie and should be authenticated

// ie the userId from the content and the userid of the incoming req
// should be the same

userRouter.delete("/remove", authMiddleware, async (req, res) => {
  const deleteId = req.body.deleteId;
  // @ts-ignore
  const userId = req.userId;

  const response = await contentModel.findOne({
    _id: deleteId,
  });
  // console.log(response!.userId.toString());
  // console.log(userId.toString());
  if (userId === response?.userId.toString()) {
    const result = await contentModel.findByIdAndDelete(deleteId);
    if (result) {
      res.send({
        msg: "Deletion Successfull",
      });
    } else {
      res.send({
        msg: "Some Unknown Error on the delete endpoint okay",
      });
    }
  } else {
    res.sendStatus(403);
  }
});

// The bwlow Endpoint is used to Generate an Shareable link to the Seceond Brain Dump and one who is logged in can only share his second brain
// we also have to make an link ans store it in DB each user can have one shareable link which it can share with the world one to one mapping
userRouter.post("/brain/share", authMiddleware, async (req, res) => {
  const share = req.body.share;
  // console.log(share);
  const hash = random(10);
  if (share) {
    try {
      await linkModel.create({
        hash: hash,
        // @ts-ignore
        userId: req.userId,
      });
      res.send({
        hash: "/share/" + hash,
      });
    } catch (e) {
      const response = await linkModel.findOne({
        // @ts-ignore
        userId: req.userId,
      });
      res.send({
        hash: "/share/" + response?.hash,
      });
    }
  } else {
    await linkModel.deleteOne({
      // @ts-ignore
      userId: req.userId,
    });
    res.send({
      message: "Link Removed",
    });
  }
});

userRouter.get("/brain/share/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  // using the hash to find the userId

  const link = await linkModel.findOne({
    hash: hash,
  });
  if (!link) {
    res.send({
      message: "Sorry Incorrect Input",
    });
    return;
  }

  // using the userId to Retrive Contents From the Contents table
  //   console.log(link?.userId);
  const contents = await contentModel.find({
    userId: link?.userId,
  });

  // we Also want the username
  //   console.log(contents);

  const username = await userModel.findOne({
    _id: link.userId,
  });

  // now Sending the content fetched to the frontend
  // console.log(username);
  res.send({
    username: username?.username,
    contents: contents,
  });
});

userRouter.post("/verify", authMiddleware, (req, res) => {
  res.send({
    status: true,
  });
});

export { userRouter };
