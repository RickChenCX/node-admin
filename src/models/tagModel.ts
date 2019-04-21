import mongoose from "mongoose";

export type TagModel = mongoose.Document & {
    name: String
};

const TagSchema = new mongoose.Schema({
    name: String
});
const Tag = mongoose.model("Tag", TagSchema);

export default Tag;