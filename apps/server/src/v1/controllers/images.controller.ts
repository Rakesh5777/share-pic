import { Request, Response } from "express";
import { getImages, saveImages } from "../services/images.service";

export const saveImagesController = async (req: Request, res: Response) => {
  const response = await saveImages(req);
  return res.json({ ...response });
};

export const getImagesController = async (req: Request, res: Response) => {
  const images = await getImages(req, res);
  return res.json({ images });
};