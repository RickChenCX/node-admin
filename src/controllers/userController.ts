import { Request, Response, NextFunction } from "express";
import logger from "../util/logger";
const SvgCaptcha = require("svg-captcha");
const CryptoJS = require("crypto-js");
import "../config/passportConfig";
import passport = require("passport");
import { IVerifyOptions } from "passport-local";
import { default as User, UserModel } from "../models/userModel";
const valid = require("express-validator");

class UserController {
    constructor() {
    }
    Login(req: Request, res: Response, next: NextFunction): void {
        if (req.user) {
            return res.redirect("/");
          }
          res.render("login", {
            title: "Login",
          });
    }
    Register(req: Request, res: Response, next: NextFunction): void {
      if (req.user) {
          return res.redirect("/");
        }
        res.render("register", {
          title: "register",
        });
  }
    getSvgCaptcha(req: Request, res: Response, next: NextFunction): void {
        let captcha: any = SvgCaptcha.create({
            size: 4,
            ignoreChars: "0o1i",
            noise: 4,
            color: true,
            background: "#cc9966"
        });
        req.session.captcha = captcha.text;
        res.type("svg");
        res.status(200).send(captcha.data);
    }
    postLogin(req: Request, res: Response, next: NextFunction): void {
        logger.info( req.session.captcha);
        req.checkBody("username", "userName is empty").notEmpty();
        req.checkBody("password", "password is empty").notEmpty();
        req.checkBody("captcha", "captcha is empty").notEmpty();
        let smallCaptcha = req.body.captcha.toLowerCase();
        let localCaptcha = req.session.captcha.toLowerCase();
        if (req.validationErrors()) {
          req.flash("errors", "参数错误");
          return res.redirect("/login");
        }
        if (smallCaptcha != localCaptcha) {
          req.flash("errors", "验证码错误");
          return res.redirect("/login");
        }

        passport.authenticate("local", (err: Error, user: UserModel, info: IVerifyOptions) => {
            if (err) { return next(err); }
            if (!user) {
              res.locals.message = req.flash("errors", info.message);
              return res.redirect("/login");
            }

            req.logIn(user, (err) => {
              if (err) { return next(err); }
              res.locals.message = req.flash("success",  "Success! You are logged in.");
              res.redirect("/");
            });

          })(req, res, next);
      }
      register(req: Request, res: Response, next: NextFunction): void {
        req.checkBody("username", "userName is empty").notEmpty();
        req.checkBody("password", "password is empty").notEmpty();

        if (req.validationErrors()) {
          res.locals.message = req.flash("errors", "参数错误");
          return res.redirect("/register");
        }
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
        User.findOne({username: req.body.username}, (err, existingUser) => {
          if (err) {return next(err); }
          if (existingUser) {
            res.locals.message = req.flash("errors", "username is already exists." );
            return res.redirect("/register");
          }
          user.save((err) => {
              if (err) { return next(err); }
              req.logIn(user, (err) => {
                if (err) {
                  return next(err);
                }
                res.redirect("/");
              });
            });
        });

      }
     async getUsrList(req: Request, res: Response, next: NextFunction) {
        let msg = await User.find({}, {username: 1, _id: 1}, (err, data) => {
          if (err) return err ;
          logger.info("query successful ");
          return data;
        });
        res.send(JSON.stringify(msg));

    }
    async deleteUser(req: Request, res: Response) {
      let msg = await User.findByIdAndRemove(req.query.id, (err, data) => {
        if (err) return err;
        logger.info("delete successful");
        return JSON.stringify(data);
      });
      res.send(msg);
    }
    async quitUser(req: Request, res: Response) {
      req.logout();
      res.redirect("/");
    }
}

let user =  new UserController();
module.exports = user;
