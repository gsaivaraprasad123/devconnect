// src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from "express";
import redis from "../services/redisClient.js";

export const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ip = req.ip;
    const key = `rate:${ip}`;

    const requests = await redis.incr(key);

    if (requests === 1) {
      await redis.expire(key, 60); // reset after 60s
    }

    if (requests > 5) {
      res.status(429).json({ error: "Too many requests, slow down!" });
      return; // stop execution here
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    next(); // fallback to allow request if Redis fails
  }
};
