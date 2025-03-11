const Redis = require("ioredis");
const redisClient = new Redis();

redisClient.on("error", (err) => console.error("Redis Error:", err));

module.exports = redisClient;
