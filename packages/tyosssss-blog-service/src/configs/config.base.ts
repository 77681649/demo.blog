import * as path from "path";

export default {
  apiPrefix: "/api",

  logDirPath: path.join(__dirname, "../../logs"),

  mongodb: {
    connectionString: "mongodb://localhost/blog"
  }
};
