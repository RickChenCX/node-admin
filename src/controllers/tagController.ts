import { Request, Response, NextFunction } from "express";
import logger from "../util/logger";
import { default as Tag, TagModel } from "../models/tagModel";

class TagControl {
    constructor() {
    }
    addTag(req: Request, res: Response, next: NextFunction) {
        const TagData = new Tag({
            name: req.query.name
        });
        Tag.findOne({name: req.query.name}, (err, existingTag) => {
            if (err) {
                res.locals.message = req.flash("error", "添加失败" );
                return res.send({errorCode: 500, errorMessage: "添加失败"});
            }
            if (existingTag) {
                res.locals.message = req.flash("error", "已存在该数据" );
                return res.send({errorCode: 500, errorMessage: "添加失败"});
            }
            TagData.save( (err) => {
                if (err) {
                    return next(err);
                }
                res.locals.message = req.flash("success", "添加成功" );
                return res.send({errorCode: 200, errorMessage: "添加成功"});
            });
        });
    }
    selectTag(req: Request, res: Response, next: NextFunction) {
        Tag.find((err: any, data: Document[]) => {
            if (err) return next(err);
            res.json(data);
        });
    }
    deleteTag(req: Request, res: Response, next: NextFunction) {
        Tag.deleteOne({_id: req.query.id}, (err) => {
            if (err) {
                res.locals.message = req.flash("error", "删除失败" );
                res.send({errorCode: 500, errorMessage: "添加失败"});
            }
            res.send({errorCode: 200, errorMessage: "删除成功"});
        });
    }
    updateTag(req: Request, res: Response, next: NextFunction) {
        let TagData = new Tag({
            name: req.body.name
        });
        Tag.findByIdAndUpdate(req.body._id, TagData, (err) => {
            if (err) {
                res.locals.message = req.flash("error", "更新失败" );
                res.send({errorCode: 500, errorMessage: "更新失败"});
            }
            res.send({errorCode: 200, errorMessage: "更新成功"});
        });
    }
}

module.exports = new TagControl();