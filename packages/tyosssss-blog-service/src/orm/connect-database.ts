import * as mongoose from "mongoose";
import configs from "../configs";

export default function connectDatabase() {
  console.log(configs.mongodb.connectionString);
  mongoose
    .connect(configs.mongodb.connectionString)
    .then(r => {
      console.log("mongodb is connected");
    })
    .catch(err => {
      console.error("mongodb occur error.", err);
    });
}
