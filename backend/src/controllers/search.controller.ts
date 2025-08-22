import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const searchPosts = async (req: Request, res: Response) => {
  const query = req.query.q as string || '';
  const sortBy = req.query.sortBy as string || 'recent'; // likes or recent

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: sortBy === 'likes'
        ? { likes: 'desc' }
        : { createdAt: 'desc' },
      include: {
        author: true,
      },
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Search failed.' });
  }
};