import { createClient, RedisClientType } from "redis";

export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

export const initRedis = async () => {
  redisClient.on("connect", () => console.log("successfully connect to redis"));

  await redisClient.connect();
};
