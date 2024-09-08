import { NextFunction, Request, Response } from "express";

type AsyncWrapperType = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch(next);
  };
};
