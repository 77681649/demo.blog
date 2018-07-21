import { Router, Request, Response, NextFunction } from "express";
import { respondSuccess, respondError } from "./helpers/respond-helper";
import { blog } from "../../typings/tyosssss-blog";

const router: Router = Router();

router.get("/user/status", function(req: Request, res: Response) {
  respondSuccess(res, {
    logined: !!req.session.user
  });
});

router.get("/user/signin", function(req: Request, res: Response) {
  let { username, password } = req.query;

  if (username === "tyosssss" && password === "7792531zsD!!") {
    req.session.user = {
      username,
      password
    };

    req.session.save(() => {
      respondSuccess(res, {
        ok: true
      });
    });
  } else {
    respondError(res, new Error("The username or password is invalid."));
  }
});

export default router;
