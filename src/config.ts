import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { oauthRouter } from "./routers/oauthRouter";

export const app: Express = express();

app.use(express.json(), express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/oauth", oauthRouter);
