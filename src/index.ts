import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to nofamex oauth api");
});

app.listen(process.env.PORT || "500", () => console.log("server starting"));
