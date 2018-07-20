import { Response } from "express";
import { blog } from "../../../typings/tyosssss-blog";

export const RESP_CODE_SUCCESS: number = 0;

export function respondSuccess(res: Response, data?: any) {
  res.status(200);
  res.send(createAPIResponse(RESP_CODE_SUCCESS, "", data));
  res.end();
}

export function respondError(res: Response, err: Error) {
  res.status(200);
  res.send(createAPIResponse(RESP_CODE_SUCCESS, err.message || ""));
  res.end();
}

export function createAPIResponse(
  errcode: number,
  errmessage: string,
  data?: any
): blog.APIResponse {
  return {
    head: createAPIResponseHeader(errcode, errmessage),
    data: data ? data : null
  };
}

export function createAPIResponseHeader(
  errcode: number = 0,
  errmessage: string = ""
): blog.APIHeaderResponse {
  return {
    errcode,
    errmessage
  };
}
