import { Application } from "express";
import configs from "../configs";
import articleRouter from "./article";
import userRouter from "./user";

const API_PREFIX = configs.apiPrefix;

export function injectRoutes(app: Application) {
  app.use(API_PREFIX, articleRouter);
  app.use(API_PREFIX, userRouter);
}
