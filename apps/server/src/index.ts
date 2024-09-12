import express from "express";
import router from "./v1/routes";
import cors from "cors";
import { errorHandler } from "./v1/middleware/error.middleware";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = process.env.PORT || 8080;
const apiVersion = process.env.API_VERSION || "v1";

export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use(`/api/${apiVersion}`, router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
