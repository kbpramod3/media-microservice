import Redis from "ioredis";

export const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});