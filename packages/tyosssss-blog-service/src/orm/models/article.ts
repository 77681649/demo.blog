import * as mongoose from "mongoose";
import { Document } from "mongoose";
import { ArticleSchema, ArticleDocument } from "../schemas";
import { ObjectId } from "../../../node_modules/@types/bson";

const Model = mongoose.model("Article", ArticleSchema);

/**
 * ArticleModel
 */
export default class ArticleModel {
  static save(doc: object): Promise<Document> {
    return new Model(doc).save();
  }

  static findById(id: ObjectId): Promise<Document> {
    return Model.findById(id).exec();
  }

  static find(): Promise<Document[]> {
    const conditions = {};

    return Model.find().exec();
  }
}
