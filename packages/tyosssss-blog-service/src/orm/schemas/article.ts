import { Schema, Model } from "mongoose";
import { updateTimeHelper } from "./helpers";
import { blog } from "../../../typings/tyosssss-blog";

const ArticleSchema = new Schema(
  {
    /**
     * 文章分类
     */
    category: {
      type: String,
      trim: true,
      required: true
    },
    /**
     * 文章标题
     */
    title: {
      type: String,
      trim: true,
      required: true
    },
    /**
     * 文章正文
     */
    content: {
      type: String
    },
    /**
     * 文章路径
     */
    path: {
      type: String
    },
    /**
     * 是否隐藏
     */
    hidden: {
      type: Boolean,
      default: false
    },
    /**
     * 标签
     */
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    /**
     * 创建时间
     */
    createAt: {
      type: Date,
      default: Date.now
    },
    /**
     * 修改时间
     */
    updateAt: {
      type: Date
    },
    /**
     * 元数据
     */
    meta: {
      /**
       * 阅读数
       */
      pv: Number,
      /**
       * 赞的数据量
       */
      favour: Number
    }
  },
  {
    collection: "articles"
  }
);

/**
 * 按时间排序
 */
ArticleSchema.index({
  updateAt: -1,
  title: 1
});

/**
 * 按标题搜索
 */
ArticleSchema.index({
  category: 1,
  updateAt: 1,
  title: 1
});

/**
 * 按tag 排序
 */
ArticleSchema.index({
  tags: 1,
  updateAt: -1,
  title: 1
});

/**
 * 按赞的数量排序
 */
ArticleSchema.index({
  "meta.favour": -1,
  title: 1
});

/**
 * 按阅读数排序
 */
ArticleSchema.index({
  "meta.pv": -1,
  title: 1
});

ArticleSchema.pre<blog.document.ArticleDocument>("save", function(next) {
  updateTimeHelper(this);
  next();
});

/**
 * 按赞的数量排序
 */
export { ArticleSchema };
