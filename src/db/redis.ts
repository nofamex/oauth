import { createClient, RedisClientType } from "redis";

export const redisClient: RedisClientType = createClient();

export const initRedis = async () => {
  redisClient.on("connect", () => console.log("successfully connect to redis"));

  await redisClient.connect();
};
