const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

let isConnected = false;

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis Connected Successfully");
});

redisClient.on("ready", () => {
  isConnected = true;
  console.log("Redis is Ready to Use");
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Redis Connection Failed:", err);
  }
})();

module.exports = {
  getClient: () => {
    if (!isConnected) {
      console.error("Redis client is not initialized or not ready!");
      return null;
    }
    return redisClient;
  }
};
