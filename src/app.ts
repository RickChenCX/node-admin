import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import logger from "./util/logger";
import lusca from "lusca";
import dotenv from "dotenv";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import cors from "cors";

// import history from "connect-history-api-fallback";

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Controllers (route handlers)
// import * as homeController from "./controllers/home";
// import * as userController from "./controllers/user";
// import * as apiController from "./controllers/api";
// import * as contactController from "./controllers/contact";
const user = require("./controllers/userController");
const fsMd = require("./controllers/fsMdFileController");
const home = require("./controllers/home");

// API keys and Passport configuration
import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = "mongodb://localhost:27017/blog" ; // "mongodb://localhost:27017/blog"; // ;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, {useMongoClient: true}).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/register" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user ) {
    req.session.returnTo = req.path;
  }
  next();
});
// app.all("*", passportConfig.isAuthorized);


// cors 配置
let whitelist: Array<string> = ["http://localhost:8080", "http://localhost:8081"];
let corsOptionsDelegate = function (req: any, callback: any) {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(undefined, corsOptions); // callback expects two parameters: error and options
};
/**
 * router 路由
 */
app.get("/login", user.Login);
app.get("/", home.index);
app.get("/register", user.Register);
app.get("/userForm", home.userForm);
app.get("/messages", home.messagePage);
app.get("/file", home.filePage);

/**
 * 图片验证码
 */
app.get("/pictrue/captcha", user.getSvgCaptcha);
/**
 * 登陆验证接口
 */
app.post("/controller/login", user.postLogin);
/**
 * 注册接口
 */
app.use("/controller/register", user.register);
app.use("/file", cors(corsOptionsDelegate), fsMd.fileMessage);
/**
 * admin用户列表
 */
app.use("/controller/adminUserList", user.getUsrList);
/**
 * 删除用户
 */
app.use("/controller/deleteUser", user.deleteUser);
/**
 * 更新用户账号密码
 */
app.use("/controller/updateUser", user.updateUser);
/**
 * 用户登出
 */
app.use("/controller/logout", user.quitUser);

export default app;