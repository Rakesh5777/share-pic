import express from "express";
import router from "./v1/routes";
import cors from "cors";
import { errorHandler } from "./v1/middleware/error.middleware";

const app = express();
const port = process.env.PORT || 8080;
const apiVersion = process.env.API_VERSION || "v1";

app.use(cors());
app.use(express.json());

app.use(`/api/${apiVersion}`, router);

// error handler implementation

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.log("..............----------------------- error handler");
    errorHandler(err, _req, res, _next);
  }
);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
