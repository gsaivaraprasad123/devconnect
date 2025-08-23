import redis from "./services/redisClient";

async function testRedis() {
  await redis.set("ping", "pong");
  const val = await redis.get("ping");
  console.log("Redis test value:", val);
  process.exit(0);
}

testRedis();