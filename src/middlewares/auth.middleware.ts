import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const authenticateToken = (req :Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // <-- fixed here

    if(!token) return res.status(401).json({msg: "Token required"});

    jwt.verify(token, JWT_SECRET, (err, user)=>{
        if(err) return res.status(403).json({msg: "Invalid token"});
        (req as any).user = user;
        next();
    })
}