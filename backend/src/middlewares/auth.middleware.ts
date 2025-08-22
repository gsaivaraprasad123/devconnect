import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // <-- fixed here

  if (!token) {
    res.status(401).json({ msg: "Token required" });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
        res.status(403).json({ msg: "Invalid token" });
      return;
    }
    (req as any).user = user;
    next();
  });
};
