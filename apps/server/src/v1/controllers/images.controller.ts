import { Request, Response } from "express";
import {
  deleteExpiredImageGroups,
  getImages,
  saveImages,
} from "../services/images.service";

export const saveImagesController = async (req: Request, res: Response) => {
  const response = await saveImages(req);
  return res.json({ ...response });
};

export const getImagesController = async (req: Request, res: Response) => {
  const images = await getImages(req);
  return res.json({ images });
};

export const deleteExpiredImageGroupsController = async (
  req: Request,
  res: Response
) => {
  await deleteExpiredImageGroups();
  return res.json({ message: "Delete expired images" });
};