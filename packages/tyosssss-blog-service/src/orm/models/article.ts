import * as mongoose from "mongoose";
import { ArticleSchema } from "../schemas";
import Logger from "logger";
import { blog } from "../../../typings/tyosssss-blog";
import { fixXSS } from "../helpers";

type Article = blog.entity.Article;
type ArticleDocument = blog.document.ArticleDocument;
type ArticleListSortKey = blog.ArticleListSortKey;
type SortDirection = blog.SortDirection;

const DEFAULT_SORT_KEY: ArticleListSortKey = blog.ArticleListSortKey.time;
const DEFAULT_SORT_DIR: SortDirection = blog.SortDirection.desc;
const DEFAULT_PAGE_INDEX: number = 0;
const DEFAULT_PAGE_SIZE: number = 20;

const Model = mongoose.model<ArticleDocument>("Article", ArticleSchema);

function ensureSortKeySafety(sort_key: ArticleListSortKey): ArticleListSortKey {
  if (
    !sort_key ||
    (sort_key != blog.ArticleListSortKey.time &&
      sort_key != blog.ArticleListSortKey.pv &&
      sort_key != blog.ArticleListSortKey.favour)
  ) {
    sort_key = DEFAULT_SORT_KEY;
  }

  return sort_key;
}

function ensureSortDirSafety(sort_dir: SortDirection): SortDirection {
  if (
    !sort_dir ||
    (sort_dir != blog.SortDirection.asc && sort_dir != blog.SortDirection.desc)
  ) {
    sort_dir = DEFAULT_SORT_DIR;
  }

  return sort_dir;
}

function ensurePageIndexSafety(page_index: number): number {
  page_index = Number(page_index);

  if (Number.isNaN(page_index) || page_index < 0) {
    page_index = DEFAULT_PAGE_INDEX;
  }

  return page_index;
}

function ensurePageSizeSafety(page_size: number): number {
  page_size = Number(page_size);

  if (Number.isNaN(page_size) || page_size < 0) {
    page_size = DEFAULT_PAGE_SIZE;
  }

  return page_size;
}

/**
 * ArticleModel
 */
export default class ArticleModel extends Model {
  /**
   * 获得指定id的文章
   */
  static get(id: string): Promise<Article> {
    Logger.debug("get id", id);

    if (!id) {
      throw new Error('The "article-id" param is null');
    }

    return this.findById(id)
      .exec()
      .then(({ _id, title, category, hidden, tags, path, meta }) => ({
        id: _id,
        category,
        title,
        hidden,
        tags,
        path,
        meta
      }));
  }

  /**
   * 获得指定id的文章
   */
  static getList(params: blog.ArticleListRequestParams): Promise<Article[]> {
    Logger.debug("get list params:", params);

    let { tags, category, sort_key, sort_dir, page_index, page_size } = params;

    if (tags && !Array.isArray(tags)) {
      throw new Error("tags is invalid, it must be an array.");
    }

    sort_key = ensureSortKeySafety(sort_key);
    sort_dir = ensureSortDirSafety(sort_dir);
    page_index = ensurePageIndexSafety(page_index);
    page_size = ensurePageSizeSafety(page_size);

    let collections: any = {};

    if (category) {
      collections.category = category;
    }

    if (tags && tags.length) {
      collections.tags = {
        $in: tags
      };
    }

    let sort: any = {
      [sort_key]: sort_dir === blog.SortDirection.desc ? -1 : 1
    };

    console.log(sort);

    let skip = page_index * page_size;
    let limit = page_size;

    return this.find(collections)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec()
      .then(docs =>
        docs
          .map(doc => doc.toJSON())
          .map(({ _id, category, title, hidden, tags, path, meta }) => ({
            id: _id,
            category,
            title,
            hidden,
            tags,
            path,
            meta
          }))
      );
  }

  /**
   * 保存 - 新增 or 更新
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

  static incrementPV(id: string): Promise<ArticleDocument> {
    if (!id) {
      throw new Error('The "article-id" param is null');
    }

    return this.findByIdAndUpdate(id, {
      $inc: {
        "meta.pv": 1
      },
      $set: {
        updateAt: new Date()
      }
    }).exec();
  }

  /**
   * 插入新文档
   */
  static insert(doc: Article): Promise<ArticleDocument> {
    doc.content = fixXSS(doc.content);
    return new this(doc).save();
  }

  /**
   * 局部更新 - 仅更新指定的字段
   */
  static updatePartial(doc: Article): Promise<ArticleDocument> {
    let $set: Article = {};

    if (doc.category) {
      $set.category = doc.category;
    }

    if (doc.title) {
      $set.title = doc.title.trim();
    }

    if (doc.content) {
      $set.content = fixXSS(doc.content.trim());
    }

    if (doc.path) {
      $set.path = doc.path.trim();
    }

    if (doc.tags) {
      $set.tags = doc.tags.split(",").map(tag => tag.toLowerCase());
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
