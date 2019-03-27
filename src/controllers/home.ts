import { Request, Response, NextFunction } from "express";

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.redirect("/login");
  }
  res.render("home", {
    title: "Home"
  });
};
