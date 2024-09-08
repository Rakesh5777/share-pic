import { Request, Response } from "express";
import { saveImages } from "./service";

export const saveImagesController = async (req: Request, res: Response) => {
  const { body } = req;
  const response = saveImages(body);
  return res.json({ ...response });
};
