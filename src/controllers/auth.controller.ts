import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ msg: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ msg: "User created", user });
    return;
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } }); // ✅ fixed here
    if (!user) {
      res.status(404).json({ msg: "User not found" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
       res.status(401).json({ msg: "Invalid credentials" });
       return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "10d" });

     res.json({ token, user });
     return;
  } catch (err) {
     res.status(500).json({ msg: "Login failed", error: err });
     return;
  }
};
