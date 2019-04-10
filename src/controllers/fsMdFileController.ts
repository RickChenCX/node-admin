import path from "path";
import fs from "fs";
import logger from "../util/logger";
import { Request, Response, NextFunction } from "express";
import formidable from "formidable";
import { default as File, FileModel } from "../models/fileModel";

class ReadMdFile   {
    constructor() {
        // super();
    }
    // 已弃用 fileMessage 方法
    public fileMessage(req: Request, res: Response, next: NextFunction): void {
        let data: string = "";
        let readStream: any = fs.createReadStream( path.resolve(__dirname, "../public/md/interface.md"), {encoding: "utf-8"});
        // logger.info( readStream );

        // 读取文件发生错误事件
        readStream.on("error", ( err: any ) => {
            logger.error("发生异常:", err);
            next();
        });
        // 已打开要读取的文件事件
        readStream.on("open", (fd: any) => {
            logger.info("文件已打开:", fd);
        });
        // 文件已经就位，可用于读取事件
        readStream.on("ready", () => {
            logger.info("文件已准备好..");
        });
        // 文件读取中事件·····
        readStream.on("data", (chunk: any) => {
            // logger.info("读取文件数据:", chunk);
            data += chunk;
        });
        // 文件读取完成事件
        readStream.on("end", () => {
            console.log("读取已完成..");
            res.send(data);
        });
        // 文件已关闭事件
        readStream.on("close", () => {
            console.log("文件已关闭！");
        });
    }
    public uploadMdFie(req: Request, res: Response, next: NextFunction) {
        let form = new formidable.IncomingForm();
        form.encoding = "utf-8";
        form.uploadDir = path.resolve(__dirname, "../public/md");
        form.keepExtensions = true;

        form.parse(req, function(err, fields, files) {
            if (err) return next(err);
            let filePath = files.file.path;
            let fileName = files.file.name;
            let data: string = "";
            let readStream = fs.createReadStream(filePath, {encoding: "utf-8"});
            // 读取文件发生错误事件
            readStream.on("error", ( err: any ) => {
                logger.error("发生异常:", err);
                next();
            });
            // 已打开要读取的文件事件
            readStream.on("open", (fd: any) => {
                logger.info("文件已打开:", fd);
            });
            // 文件已经就位，可用于读取事件
            readStream.on("ready", () => {
                logger.info("文件已准备好..");
            });
            // 文件读取中事件·····
            readStream.on("data", (chunk: any) => {
                // logger.info("读取文件数据:", chunk);
                data += chunk;
            });
            // 文件读取完成事件
            readStream.on("end", () => {
                console.log("读取已完成..");
                const FileArg = new File({
                    language: fields.language,
                    title: fields.title,
                    subtitle: fields.subtitle,
                    createTime: fields.createTime,
                    content: data
                });
                FileArg.save( (err) => {
                    if (err) return next(err);
                    res.locals.message = req.flash("success", "添加成功" );
                    res.send({errorCode: 200, errorMessage: "上传成功"});
                });
            });
            // 文件已关闭事件
            readStream.on("close", () => {
                console.log("文件已关闭！");
            });
            // logger.info("info", {message: fields});
            // logger.info("path", {message: files.file.path});
        });
    }
    public async selectFile(req: Request, res: Response, next: NextFunction) {
        let arg = req.body || {};
        await File.find(arg , (err: any, doc: Document[]) => {
            if (err) {
                res.locals.message = req.flash("errors", err);
                return res.redirect("/");
            }
            res.json(doc);
        });
    }
}

module.exports = new ReadMdFile();