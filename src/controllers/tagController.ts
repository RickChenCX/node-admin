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
                res.locals.message = req.flash("errors", "添加失败" );
                return res.redirect("/tag?name=tag");
            }
            if (existingTag) {
                res.locals.message = req.flash("errors", "已存在该数据" );
                return res.redirect("/tag?name=tag");
            }
            TagData.save( (err) => {
                if (err) {
                    return next(err);
                }
                res.locals.message = req.flash("success", "添加成功" );
                return res.redirect("/tag?name=tag");
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
                res.locals.message = req.flash("errors", "删除失败" );
                return res.redirect("/tag?name=tag");
            }
            // res.locals.message = req.flash("success", "删除成功" );
            res.send({errorCode: 200, errorMessage: "删除成功"});
        });
    }
    updateTag(req: Request, res: Response, next: NextFunction) {
        // logger.info("info", {info: req.query});
        // logger.info("info", {info: req.body});
        // logger.info("info", {info: req.params});
        let TagData = {
            name: req.query.name
        };
        Tag.findByIdAndUpdate(req.query._id, TagData, (err) => {
            if (err) {
                logger.info("info", {error: err});
                res.locals.message = req.flash("errors", "更新失败" );
                return res.redirect("/tag?name=tag");
            }
            res.locals.message = req.flash("success", "更新成功" );
            return res.redirect("/tag?name=tag");
        });
    }
}

module.exports = new TagControl();