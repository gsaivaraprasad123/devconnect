import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";

const prisma = new PrismaClient();

export const searchPosts = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { [sortBy]: 'desc' },
      skip,
      take: limit,
      include: { author: true }
    }),
    prisma.post.count({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      }
    })
  ]);

  res.status(200).json({
    success: true,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: posts
  });
});
