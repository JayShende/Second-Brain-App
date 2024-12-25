"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsModel = exports.linkModel = exports.contentModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = Schema.ObjectId;
//  Declaring Various Schemas
const userSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
});
const contentTypes = ["youtube", "twitter"]; // Extend as needed
const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes },
    title: { type: String, required: true },
    tags: [{ type: ObjectId, ref: "tags" }],
    userId: { type: ObjectId, ref: "users", required: true },
});
const tagsSchema = new Schema({
    title: { type: String, required: true, unique: true }
});
const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: ObjectId, ref: "users", required: true, unique: true },
    // above we made the unique true since we want inly one link per user
});
const userModel = mongoose_1.default.model("users", userSchema);
exports.userModel = userModel;
const contentModel = mongoose_1.default.model("content", contentSchema);
exports.contentModel = contentModel;
const linkModel = mongoose_1.default.model("link", linkSchema);
exports.linkModel = linkModel;
const tagsModel = mongoose_1.default.model("tags", tagsSchema);
exports.tagsModel = tagsModel;
