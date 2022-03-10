import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../schema/user";
import { OK } from "http-status";
import Client from "../schema/client";
import { v4 as uuidv4 } from "uuid";

export const oauthRouter = Router();

oauthRouter.post("/register/user", async (req: Request, res: Response) => {
  //ToDo: Add input validation
  const { username, fullName, npm, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: username,
    fullName: fullName,
    npm: npm,
    password: hashedPassword,
  });

  res.status(OK).json(user);
});

oauthRouter.post("/register/client", async (req: Request, res: Response) => {
  //ToDo: Add input validation
  const { name } = req.body;

  const client = await Client.create({
    name: name,
    clientSecret: uuidv4(),
  });

  res.status(OK).json(client);
});
