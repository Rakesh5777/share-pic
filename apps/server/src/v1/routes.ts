import express from "express";
import { saveImagesController } from "./controllers/images.controller";
import { zodValidatorMiddleware } from "./middleware/zodValidator.middleware";
import { asyncWrapper } from "./utils/asyncWrapper";
import { SaveImagesSchema } from "./validators/schema";
import upload from "./middleware/multer.middleware";
import generateFolderMiddleware from "./middleware/generateFolder.middleware";

const router = express.Router();

router.post(
  "/images",
  // zodValidatorMiddleware(SaveImagesSchema),
  generateFolderMiddleware,
  upload.array("images", 10),
  asyncWrapper(saveImagesController)
);

export default router;
