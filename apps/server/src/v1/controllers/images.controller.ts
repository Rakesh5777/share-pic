import { Request, Response } from "express";
import { saveImages } from "../services/images.service";

export const saveImagesController = async (req: Request, res: Response) => {
  const { body } = req;
  const response = saveImages(body);
  return res.json({ ...response });
};
