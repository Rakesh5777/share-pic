import { z } from "zod";

export const SaveImagesSchema = z.object({
  images: z.array(z.string()),
  expiry: z.string(),
});

export type SaveImagesType = z.infer<typeof SaveImagesSchema>;
