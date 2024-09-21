import express from "express";
import router from "./v1/routes";
import cors from "cors";
import { errorHandler } from "./v1/middleware/error.middleware";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { constants } from "./v1/utils/constants";
import cron from "node-cron";
import { deleteExpiredImageGroups } from "./v1/services/images.service";

const app = express();
const port = process.env.PORT || 8080;
const apiVersion = process.env.API_VERSION || "v1";

app.use(cors());

// Serve static images
app.use(
  `/${constants.staticFolder}`,
  express.static(path.join(process.env.UPLOADS_FOLDER!))
);

// Cron job to delete expired images
cron.schedule("0 0 * * *", async () => {
  // log("Running cron job to delete expired image groups");
  deleteExpiredImageGroups();
});

export const prisma = new PrismaClient();

app.use(express.json());

app.use(`/api/${apiVersion}`, router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
