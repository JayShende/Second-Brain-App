"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: 'src/.env' });
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    // console.log(token);
    try {
        const decode = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // console.log(decode);
        // @ts-ignore
        req.userId = decode._id;
        next();
    }
    catch (e) {
        res.sendStatus(403);
    }
};
exports.authMiddleware = authMiddleware;
