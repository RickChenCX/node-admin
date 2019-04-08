import mongoose from "mongoose";

export type FileModel = mongoose.Document & {
    language: String,
    createTime: Date,
    title: String,
    subtitle: String,
    content: String,
};

const FileSchema = new mongoose.Schema({
    language: String,
    createTime: Date,
    title: String,
    subtitle: String,
    content: String,
});

const File = mongoose.model("file", FileSchema);
export default File;