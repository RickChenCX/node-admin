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
  return res.render("userForm", {
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
export let filePage = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("file", {
    title: "file",
    username: req.user.username,
    name: req.query.name
  });
};
export let addFilePage = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("addFile", {
    title: "addFile",
    username: req.user.username,
    name: req.query.name
  });
};

export let tagPage = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("tag", {
    title: "tag",
    username: req.user.username,
    name: req.query.name
  });
};
