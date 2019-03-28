import { Request, Response, NextFunction } from "express";
import logger from "../util/logger";

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("home", {
    title: "Home",
    username: req.user.username
  });
};
export let userForm = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("userForm", {
    title: "userForm",
    username: req.user.username,
    name: req.query.name
  });
};

export let messagePage = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("messages", {
    title: "messages",
    username: req.user.username,
    name: req.query.name
  });
};
