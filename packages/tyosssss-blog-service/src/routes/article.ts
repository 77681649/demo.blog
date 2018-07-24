import { Router, Request, Response, NextFunction } from "express";
import { respondSuccess, respondError } from "./helpers/respond-helper";
import { ArticleModel } from "../orm/models";
import { blog } from "../../typings/tyosssss-blog";
import * as path from "path";

const router: Router = Router();

/**
 * 获得文章列表
 */
router.get("/articles", function(req: Request, res: Response) {
  console.log(req.session);
  let query = req.query;
  let params: blog.ArticleListRequestParams = {
    category: query.category,
    tags: query.tags ? query.tags.split(",") : [],
    sort_key: query.sort_key,
    sort_dir: query.sort_dir,
    page_index: query.page_index,
    page_size: query.page_size
  };

  try {
    ArticleModel.getList(params).then(article => respondSuccess(res, article));
  } catch (err) {
    respondError(res, err);
  }
});

/**
 * 获得文章
 */
router.get("/article/:id", function(req: Request, res: Response) {
  let id = req.params.id;

  try {
    ArticleModel.get(id).then(article => respondSuccess(res, article));
  } catch (err) {
    respondError(res, err);
  }
});

/**
 * 新增或更新文章
 */
router.post("/article", function(req: Request, res: Response) {
  try {
    ArticleModel.save(req.body).then(article =>
      respondSuccess(res, { id: article.id })
    );
  } catch (err) {
    respondError(res, err);
  }
});

/**
 * 新增tags
 */
router.post("/article/:id/pv", function(req: Request, res: Response) {
  const id = req.params.id || "";

  try {
    ArticleModel.incrementPV(id).then(article =>
      respondSuccess(res, { id: article.id })
    );
  } catch (err) {
    respondError(res, err);
  }
});

/**
 * 删除tags
 */
router.delete("/article/:id/tag", function(req: Request, res: Response) {
  const id = req.params.id || "";
  const tags = req.body.tags;

  try {
    ArticleModel.removeTags(id, tags).then(article =>
      respondSuccess(res, { id: article.id })
    );
  } catch (err) {
    respondError(res, err);
  }
});

const updateRootDir = path.join(__dirname, "../../public/upload/articles");
/**
 * 上传文件
 */
router.post("/article/file", function(req: Request, res: Response) {
  debugger;
  try {
    if (!req.files) respondError(res, new Error("No files were uploaded."));

    const file = req.files.file;
    const extensions = file.name.substr(file.name.indexOf("."));
    const filename = file.md5 + extensions;

    if (file.data.length > 1 * 1024 * 1024) {
      respondError(res, new Error("The files size muse be < 1MB"));
    }

    console.log(file);
    console.log(updateRootDir);
    console.log(filename);

    // Use the mv() method to place the file somewhere on your server
    file.mv(path.join(updateRootDir, filename), function(err: Error) {
      if (err) respondError(res, err);
      else respondSuccess(res, { filename });
    });

    // );
  } catch (err) {
    respondError(res, err);
  }
});

export default router;
