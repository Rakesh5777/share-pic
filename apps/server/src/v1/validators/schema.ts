import { z } from "zod";

export const SaveImagesSchema = z.object({
  expiry: z.string(),
});

export type SaveImagesType = z.infer<typeof SaveImagesSchema>;
