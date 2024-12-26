"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
const auth_1 = require("../middleware/auth");
// import dotenv from 'dotenv';
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config({ path: "src/.env" });
// console.log(process.env.JWT_SECRET); // Outputs: your-secret-key
const jwtSecret = process.env.JWT_SECRET;
// if (!jwtSecret) {
//   throw new Error("JWT_SECRET is not defined in .env");
// }
const db_1 = require("../db");
const db_2 = require("../db");
const utils_1 = require("../utils");
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // reciving the input cred in signup
    const { username, password } = req.body;
    const signupSchema = zod_1.z.object({
        username: zod_1.z.string().min(8).max(30),
        password: zod_1.z
            .string()
            .min(8)
            .max(20)
            .refine(function (password) {
            return /[a-z]/.test(password);
        }, {
            message: "Password Must Contain atleast one Lowercase Letter",
        })
            .refine(function (password) {
            return /[A-Z]/.test(password);
        }, {
            message: "Password Must Contain At Least One Uppercase Letter",
        })
            .refine(function (password) {
            return /[0-9]/.test(password);
        }, {
            message: "Password Must Contain Atleast a Single Number",
        })
            .refine(function (password) {
            return /[\W_]/.test(password);
        }, {
            message: "Password Must Contain Atleast one Special Character",
        }),
    });
    const result = signupSchema.safeParse(req.body);
    if (result.success) {
        const hashedpwd = yield bcrypt_1.default.hash(password, 5);
        try {
            yield db_1.userModel.create({
                username: username,
                password: hashedpwd,
            });
            res.send({
                msg: "Signed in",
            });
        }
        catch (err) {
            res.send("Already Exists");
            return;
        }
    }
    else {
        res.send(result.error);
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const response = yield db_1.userModel.findOne({
        username: username,
    });
    console.log(response);
    if (response === null || response.password == null) {
        res.status(403).json({
            message: "Inavlid Email Dont Exist",
        });
        return;
    }
    else {
        // Verifying Password
        const result = yield bcrypt_1.default.compare(password, response.password);
        if (result) {
            const token = jsonwebtoken_1.default.sign({
                _id: response._id.toString(),
            }, jwtSecret);
            res.send({
                token: token,
            });
        }
        else {
            res.send({
                Message: "Invalid Password",
            });
        }
    }
}));
userRouter.post("/content", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title, tags } = req.body;
    // console.log(req.body);
    // @ts-ignore
    // console.log(req.userId);
    try {
        yield db_2.contentModel.create({
            link: link,
            type: type,
            title: title,
            // @ts-ignore
            userId: req.userId,
        });
        res.send({
            message: "Content Added Successfully!",
        });
    }
    catch (e) {
        res.send({
            message: "Some Parameter is Missing",
        });
    }
}));
userRouter.get("/content", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    // console.log(userId);
    const response = yield db_2.contentModel
        .find({
        userId: userId,
    })
        .populate("userId", "username");
    res.send(response);
}));
// before deleting any content we have to ensure that the content belongs to the
// particular perosn only ie and should be authenticated
// ie the userId from the content and the userid of the incoming req
// should be the same
userRouter.delete("/remove", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteId = req.body.deleteId;
    // @ts-ignore
    const userId = req.userId;
    const response = yield db_2.contentModel.findOne({
        _id: deleteId,
    });
    // console.log(response!.userId.toString());
    // console.log(userId.toString());
    if (userId === (response === null || response === void 0 ? void 0 : response.userId.toString())) {
        const result = yield db_2.contentModel.findByIdAndDelete(deleteId);
        if (result) {
            res.send({
                msg: "Deletion Successfull",
            });
        }
        else {
            res.send({
                msg: "Some Unknown Error on the delete endpoint okay",
            });
        }
    }
    else {
        res.sendStatus(403);
    }
}));
// The bwlow Endpoint is used to Generate an Shareable link to the Seceond Brain Dump and one who is logged in can only share his second brain
// we also have to make an link ans store it in DB each user can have one shareable link which it can share with the world one to one mapping
userRouter.post("/brain/share", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    // console.log(share);
    const hash = (0, utils_1.random)(10);
    if (share) {
        try {
            yield db_1.linkModel.create({
                hash: hash,
                // @ts-ignore
                userId: req.userId,
            });
            res.send({
                hash: "/share/" + hash,
            });
        }
        catch (e) {
            const response = yield db_1.linkModel.findOne({
                // @ts-ignore
                userId: req.userId,
            });
            res.send({
                hash: "/share/" + (response === null || response === void 0 ? void 0 : response.hash),
            });
        }
    }
    else {
        yield db_1.linkModel.deleteOne({
            // @ts-ignore
            userId: req.userId,
        });
        res.send({
            message: "Link Removed",
        });
    }
}));
userRouter.get("/brain/share/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    console.log("req hit");
    // using the hash to find the userId
    const link = yield db_1.linkModel.findOne({
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
    const contents = yield db_2.contentModel.find({
        userId: link === null || link === void 0 ? void 0 : link.userId,
    });
    // we Also want the username
    //   console.log(contents);
    const username = yield db_1.userModel.findOne({
        _id: link.userId,
    });
    // now Sending the content fetched to the frontend
    // console.log(username);
    res.send({
        username: username === null || username === void 0 ? void 0 : username.username,
        contents: contents,
    });
}));
userRouter.post("/verify", auth_1.authMiddleware, (req, res) => {
    res.send({
        status: true,
    });
});
