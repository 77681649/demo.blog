import { Application } from "express";
import configs from "../configs";
import { routerPath, router } from "./article";

const API_PREFIX = configs.apiPrefix;
const genPath = (prefix: string): string => API_PREFIX + prefix;

export function injectRoutes(app: Application) {
  console.log(genPath(routerPath));
  app.use(genPath(routerPath), router);
}
