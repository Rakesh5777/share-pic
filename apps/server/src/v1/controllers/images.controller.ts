import { Request, Response } from "express";
import { saveImages } from "../services/images.service";
import { SaveImagesType } from "../validators/schema";

export const saveImagesController = async (req: Request, res: Response) => {
  const body = req.body as SaveImagesType;
  const response = saveImages(body);
  return res.json({ ...response });
};
