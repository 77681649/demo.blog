import * as path from "path";
import * as createError from "http-errors";
import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";

import { injectRoutes } from "./routes";
import { connectDatabase } from "./orm";
import Logger from 'logger'


connectDatabase();


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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

module.exports = app;
