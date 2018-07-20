import * as mongoose from "mongoose";
import { ArticleSchema } from "../schemas";
import { createMongoDBError } from "errors";
import Logger from "logger";
import { blog } from "../../../typings/tyosssss-blog";
import { fixXSS } from "../helpers";

type Article = blog.entity.Article;
type ArticleDocument = blog.document.ArticleDocument;

const Model = mongoose.model<ArticleDocument>("Article", ArticleSchema);

/**
 * ArticleModel
 */
export default class ArticleModel extends Model {
  /**
   * 保存 - 新增 or 更新
   * @param article {ArticleDocument}
   */
  static save(article: Article): Promise<ArticleDocument> {
    Logger.debug("article", article);

    const promise = article.id
      ? this.updatePartial(article)
      : this.insert(article);

    return promise.catch((err: Error) => {
      Logger.error("article save error: ", err.message);
      throw err;
    });
  }

  /**
   * 新增文章的tags
   */
  static addTags(id: string, tags: string[]): Promise<ArticleDocument> {
    if (!id) {
      throw new Error('The "article-id" param is null');
    }

    tags = tags.filter(t => t).map(tag => tag.toLowerCase());

    if (tags.length) {
      return this.findByIdAndUpdate(id, {
        $addToSet: {
          tags
        },
        $set: {
          updateAt: new Date()
        }
      }).exec();
    } else {
      throw new Error("There are not valid tag.");
    }
  }

  /**
   * 移除文章的tags
   */
  static removeTags(id: string, tags: string[]): Promise<ArticleDocument> {
    if (!id) {
      throw new Error('The "article-id" param is null');
    }

    tags = tags.filter(t => t).map(tag => tag.toLowerCase());

    if (tags.length) {
      return this.findByIdAndUpdate(id, {
        $pull: {
          tags: {
            $in: tags
          }
        },
        $set: {
          updateAt: new Date()
        }
      }).exec();
    } else {
      throw new Error("There are not valid tag.");
    }
  }

  /**
   * 插入新文档
   */
  static insert(doc: Article): Promise<ArticleDocument> {
    doc.content = fixXSS(doc.content);
    return new this(doc).save();
  }

  /**
   * 布局更新 - 仅更新指定的字段
   */
  static updatePartial(doc: Article): Promise<ArticleDocument> {
    let $set: Article = {};

    if (doc.title) {
      $set.title = doc.title.trim();
    }

    if (doc.content) {
      $set.content = fixXSS(doc.content.trim());
    }

    if (doc.tags && doc.tags.length) {
      $set.tags = doc.tags.map(tag => tag.toLowerCase());
    }

    if (doc.hidden) {
      $set.hidden = !!doc.hidden;
    }

    if (Object.keys($set).length < 0) {
      throw new Error("update is error: no need update field.");
    }

    $set.updateAt = new Date();

    return this.findByIdAndUpdate(doc.id, { $set }).exec();
  }
}
