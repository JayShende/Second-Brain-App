import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//  Declaring Various Schemas

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});
const contentTypes = ["image", "video", "article", "audio"]; // Extend as needed

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes},
  title: { type: String, required: true },
  tags: [{ type:ObjectId, ref: "tags" }],
  userId: { type:ObjectId, ref: "users", required: true },
});

const tagsSchema = new Schema({
  title: { type: String, required: true, unique: true }
});

const linkSchema = new Schema({
  hash: { type: String, required: true },
  userId: { type: ObjectId, ref: "users", required: true },
});


const userModel=mongoose.model("users",userSchema);
const contentModel=mongoose.model("content",contentSchema);
const linkModel=mongoose.model("link",linkSchema);
const tagsModel=mongoose.model("tags",tagsSchema);

export {userModel,contentModel,linkModel,tagsModel};