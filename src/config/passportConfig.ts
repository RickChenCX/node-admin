import passport from "passport";
import request from "request";
import _ from "lodash";
const Strategy = require("passport-local").Strategy;
import { default as User } from "../models/userModel";
import { Request, Response, NextFunction } from "express";

// 对会话进行序列化user
passport.serializeUser<any, any>(function(user, done) {
    done(undefined, user);
  });
// 对会话进行反序列化user
passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new Strategy(
    function(username: string, password: string, done: any) {
        User.findOne({username: username}, function(err: any, user: any) {
            if (err) { return done(err) ; }
            if (!user) { return done(undefined, false, {message: "Incorrect username"}); }
            if (user.password != password ) {
                return done(undefined, false, {message: "Incorrect password"});
            }
            return done(undefined, user);
        });
    }
));


export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  };