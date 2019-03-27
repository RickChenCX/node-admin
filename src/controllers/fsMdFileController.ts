import path from "path";
import fs from "fs";
import logger from "../util/logger";
import { Request, Response, NextFunction } from "express";


class ReadMdFile {
    constructor() {
        // super();
    }
    public fileMessage(req: Request, res: Response, next: NextFunction): void {
        logger.info(__dirname);
        let data: any = "";
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
}

module.exports = new ReadMdFile();