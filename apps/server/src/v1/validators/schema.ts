import { z } from "zod";

export const SaveImagesSchema = z.object({
  image: z.array(z.string()),
  expiry: z.date(),
});

export type SaveImagesType = z.infer<typeof SaveImagesSchema>;
