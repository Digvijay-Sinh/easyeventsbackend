import { Response } from "express";

export const successResponseWithData = (
  res: Response,
  msg: string,
  data: any
) => {
  const resData = {
    status: 1,
    code: 200,
    message: msg,
    data: data,
  };
  return res.status(200).json(resData);
};

export const errorResponse = (res: Response, msg: string) => {
  const data = {
    status: 0,
    code: 500,
    message: msg,
  };
  return res.status(500).json(data);
};
