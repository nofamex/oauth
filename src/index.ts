import { Request, Response } from "express";
import { app } from "./config";
import { initDB } from "./db/mongo";
import { initRedis } from "./db/redis";

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to nofamex oauth api");
});

initRedis();
initDB();

app.listen(process.env.PORT || "5000", () => console.log("server starting"));
