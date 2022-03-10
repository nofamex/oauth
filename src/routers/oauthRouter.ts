import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../schema/user";
import { BAD_REQUEST, OK } from "http-status";
import Client from "../schema/client";
import { v4 as uuidv4 } from "uuid";
import randomstring from "randomstring";
import { body, param, validationResult } from "express-validator";
import {
  clientIdNotFoundError,
  noUsernameFoundError,
  wrongAccessTokenError,
  wrongClientSecretError,
  wrongPasswordError,
} from "../error/serviceError";
import { redisClient } from "../db/redis";

export const oauthRouter = Router();

oauthRouter.post(
  "/register/user",
  body("username").not().isEmpty(),
  body("fullName").not().isEmpty(),
  body("npm").not().isEmpty(),
  body("password").not().isEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }

    const { username, fullName, npm, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      fullName: fullName,
      npm: npm,
      password: hashedPassword,
    });

    res.status(OK).json(user);
  }
);

oauthRouter.post(
  "/register/client",
  body("name").not().isEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }

    const { name } = req.body;

    const client = await Client.create({
      name: name,
      clientSecret: uuidv4(),
    });

    res.status(OK).json(client);
  }
);

oauthRouter.post(
  "/token",
  param("username").not().isEmpty(),
  param("password").not().isEmpty(),
  param("grant_type").not().isEmpty(),
  param("client_id").not().isEmpty(),
  param("client_secret").not().isEmpty(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }

    const { username, password, grant_type, client_id, client_secret }: any =
      req.query;

    let client;
    try {
      client = await Client.findById(client_id);
    } catch (error) {
      return res.status(BAD_REQUEST).json(clientIdNotFoundError());
    }

    if (client.clientSecret !== client_secret) {
      return res.status(BAD_REQUEST).json(wrongClientSecretError());
    }

    const user = await User.findOne({}).where("username").equals(username);
    if (user === []) {
      return res.status(BAD_REQUEST).json(noUsernameFoundError());
    }

    const verified = await bcrypt.compare(password, user.password);

    if (!verified) {
      return res.status(BAD_REQUEST).json(wrongPasswordError());
    }

    const accessToken = randomstring.generate(40);
    const refreshToken = randomstring.generate(40);

    await redisClient.set(accessToken, user.id, { EX: 60 * 5 });
    await redisClient.set(refreshToken, user.id, { EX: 60 * 10 });

    await User.findOneAndUpdate(
      { id: user.id },
      { accessToken: accessToken, refreshToken: refreshToken }
    );

    const accessTokenExpired = await redisClient.ttl(accessToken);

    const response = {
      access_token: accessToken,
      expires_in: accessTokenExpired,
      token_type: "Bearer",
      scope: null,
      refresh_token: refreshToken,
    };

    return res.status(OK).json(response);
  }
);

oauthRouter.post("/resource", async (req: Request, res: Response) => {
  const token: any = req.headers.authorization?.split(" ")[1];

  const id = await redisClient.get(token);

  if (id == null) {
    return res.status(BAD_REQUEST).json(wrongAccessTokenError());
  }

  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    return res.status(BAD_REQUEST).json(clientIdNotFoundError());
  }

  const response = {
    access_token: user.accessToken,
    client_id: user.id,
    username: user.username,
    full_name: user.fullName,
    npm: user.npm,
    expires: null,
    refresh_token: user.refreshToken,
  };

  return res.status(OK).json(response);
});

oauthRouter.post("/refresh", async (req: Request, res: Response) => {
  const token: any = req.headers.authorization?.split(" ")[1];

  const id = await redisClient.get(token);

  if (id == null) {
    return res.status(BAD_REQUEST).json(wrongAccessTokenError());
  }

  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    return res.status(BAD_REQUEST).json(clientIdNotFoundError());
  }

  const accessToken = randomstring.generate(40);
  await redisClient.set(accessToken, user.id, { EX: 60 * 5 });

  await User.findOneAndUpdate({ id: user.id }, { accessToken: accessToken });

  const accessTokenExpired = await redisClient.ttl(accessToken);

  const response = {
    access_token: accessToken,
    expires_in: accessTokenExpired,
    token_type: "Bearer",
    scope: null,
    refresh_token: token,
  };

  return res.status(OK).json(response);
});
