import express from "express";
import {
  getImagesController,
  saveImagesController,
} from "./controllers/images.controller";
import { generateFolderMiddleware } from "./middleware/generateFolder.middleware";
import upload from "./middleware/multer.middleware";
import { asyncWrapper } from "./utils/asyncWrapper";

const router = express.Router();

router.post(
  "/images",
  generateFolderMiddleware,
  upload.array("images", 10),
  asyncWrapper(saveImagesController)
);

router.get("/images/:groupId", asyncWrapper(getImagesController));

export default router;
