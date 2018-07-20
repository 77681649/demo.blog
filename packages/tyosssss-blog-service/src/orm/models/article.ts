import * as mongoose from "mongoose";
import { ArticleSchema } from "../schemas";
import { createMongoDBError } from "errors";
import Logger from "logger";
import { blog } from "../../../typings/tyosssss-blog";

type ArticleDocument = blog.document.ArticleDocument;

const Model = mongoose.model<ArticleDocument>("Article", ArticleSchema);

/**
 * ArticleModel
 */
export default class ArticleModel {
  /**
   * 保存 - 新增/修改文章
   * @param article {ArticleDocument}
   */
  static save(article: any): Promise<ArticleDocument> {
    let doc: ArticleDocument = new Model(article);
debugger
    if (doc.id) {
      doc.isNew = false;
    }

    return doc.save().catch(err => {
      Logger.debug("article save error: ", err.message);
      throw err;
    });
  }

  static findById(id: string): Promise<ArticleDocument> {
    return Model.findById(id).exec();
  }

  static find(): Promise<ArticleDocument[]> {
    const conditions = {};

    return Model.find().exec();
  }
}
