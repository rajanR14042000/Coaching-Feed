import redis from "redis";

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

await redisClient.connect();

export default redisClient;