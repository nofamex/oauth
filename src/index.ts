import { Request, Response } from "express";
import { app } from "./config";
import { initDB } from "./db/db";

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to nofamex oauth api");
});

initDB();

app.listen(process.env.PORT || "5000", () => console.log("server starting"));
