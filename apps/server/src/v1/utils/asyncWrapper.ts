import { NextFunction, Request, Response } from "express";


export const asyncWrapper = <T>(
  fn: (req: Request<T>, res: Response, next: NextFunction) => Promise<any>
) => {
  return function (req: Request<T>, res: Response, next: NextFunction) {
    return fn(req, res, next).catch(next);
  };
};
