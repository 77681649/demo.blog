import { Router, Request, Response, NextFunction } from "express";
import { respondSuccess, respondError } from "./helpers/respond-helper";
import { ArticleModel } from "../orm/models";

const routerPath = "/article";
const router: Router = Router();

/**
 * 获得文章列表
 */
router.get("/", function(req: Request, res: Response) {
  respondSuccess(res, {
    total: 100,
    articles: [
      {
        id: 1,
        title: "hahah",
        content: "haha",
        tags: ["tag"]
      }
    ]
  });
});

/**
 * 新增或更新文章
 */
router.post("/", function(req: Request, res: Response) {
  ArticleModel.save(req.body)
    .then(article => respondSuccess(res, { id: article.id }))
    .catch(err => respondError(res, err));
});

/**
 * 获得文章
 */
router.get("/:id", function(req: Request, res: Response) {
  respondSuccess(res, {
    id: 1,
    title: "hahah",
    content: "haha",
    tags: ["tag"]
  });
});

export { routerPath, router };
