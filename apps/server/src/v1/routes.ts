import express from "express";
import { saveImagesController } from "./controllers/images.controller";
import { zodValidatorMiddleware } from "./middleware/zodValidator.middleware";
import { asyncWrapper } from "./utils/asyncWrapper";
import { SaveImagesSchema } from "./validators/schema";

const router = express.Router();

router.post(
  "/images",
  zodValidatorMiddleware(SaveImagesSchema),
  asyncWrapper(saveImagesController)
);

export default router;
