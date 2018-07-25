import * as path from "path";
import * as createError from "http-errors";
import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as expressSession from "express-session";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as fileUpload from "express-fileupload";

import { injectRoutes } from "./routes";
import { connectDatabase } from "./orm";
import Logger from "logger";

const corser = require("corser");

connectDatabase();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");
app.set("trust proxy", 1);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: "tyosssss.blog",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 30 * 60 * 60 * 1000
    }
  })
);
const corserRequestListener = corser.create({
  origins: "*",
  endPreflightRequests: true,
  methods: ["GET", "PUT", "POST", "DELETE"],
  requestHeaders: ["Content-Type", "X-Requested-With"]
});

app.use(function corserRequestListener(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");

  if (req.method === "OPTIONS") {
    // End CORS preflight request.

    res.writeHead(204);
    res.end();
  } else {
    // Implement other HTTP methods.
    next();
  }
});
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "../public")));

// app.use(function allowCrossDomain(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");

//   next();
// });

injectRoutes(app);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

process.on("uncaughtException", function(e) {
  Logger.fatal("uncaughtException", e);
});

process.on("unhandledRejection", function(e) {
  Logger.fatal("unhandledRejection", e);
});

module.exports = app;
