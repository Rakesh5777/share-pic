import { Request, Response } from "express";
import { saveImages } from "../services/images.service";
import { SaveImagesType } from "../validators/schema";

export const saveImagesController = async (req: Request, res: Response) => {
  const response = await saveImages(req);
  return res.json({ ...response });
};
