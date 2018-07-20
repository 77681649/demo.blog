/**
 * 定义一个全局的命名空间, 用来定义 interface , enum
 */

import { Document } from "mongoose";

export namespace blog {
  export interface APIResponse {
    head: APIHeaderResponse;
    data?: APIBodyRepsonse;
  }

  export interface APIHeaderResponse {
    errcode: number;
    errmessage: string;
  }

  export interface APIBodyRepsonse {
    data: any;
  }

  /**
   * common
   */
  export namespace common {
    export enum Environment {
      dev = "development",
      prod = "production"
    }
  }

  export namespace config {
    export interface Config {
      isDev: boolean;
      isProd: boolean;
      env: string;
      apiPrefix: string;
      logDirPath: string;
      mongodb: MongoDBConfig;
    }

    export interface MongoDBConfig {
      connectionString: string;
    }
  }

  export namespace entity {
    export interface Base {
      /**
       * 创建时间
       */
      createAt?: Date;

      /**
       * 修改时间
       */
      updateAt?: Date;
    }

    export interface Articile extends Base {
      /**
       * id
       */
      id?: string;

      /**
       * 文章标题
       */
      title?: string;

      /**
       * 文章正文
       */
      content?: string;

      /**
       * 文章标签
       */
      tags?: string[];

      /**
       * 是否隐藏
       */
      hidden?: boolean;
    }
  }
  /**
   * Document
   */
  export namespace document {
    /**
     * 文章 Document
     */
    export type ArticleDocument = BaseDocument & entity.Articile;

    /**
     * base 文档
     */
    export type BaseDocument = Document & entity.Base;
  }

  export namespace error {
    export interface MongoDBError extends Error {
      code: number;
    }
  }
}
