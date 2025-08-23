import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import redis from "../services/redisClient";

const prisma = new PrismaClient();

export const createPost = async(req: Request, res : Response)=>{
    const {title, content} = req.body;
    const userId = (req as any).user.id;

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: userId,
            },
        });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({msg: "Failed to create post", error: err})
    }
}

// controllers/post.controller.ts

export const getAllPosts = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * limit;

  const cacheKey = `posts:limit=${limit}:page=${page}`;

  try {
    const cached = await redis.get(cacheKey);
   if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }


  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      include: { author: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count()
  ]);

      const response = {
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: posts,
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    res.status(200).json(response);
}catch(error){
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, message: "Server error" });
}
}


export const updatePost = async(req: Request, res: Response) =>{
    const {id} = req.params;
    const {title, content}  = req.body;
    const userId = (req as any).user.id;

    const post = await prisma.post.findUnique({where: {id}});
    if(!post || post.authorId != userId){
        res.status(403).json({msg: "Not authorised to edit this post"});
        return;
    }

    const updated = await prisma.post.update({
        where:{id},
        data:{title, content}
    })

    res.json(updated);
}

export const deletePost = async (req: Request, res: Response)=>{
    const {id} = req.params;
    const userId = (req as any).user.id;

    const post = await prisma.post.findUnique({where: {id}});
    if(!post || post.authorId != userId){
        res.status(403).json({msg: "Not authorised to delete this post"});
        return;
    }

    await prisma.post.delete({where: {id}});

    res.json({msg: "Post deleted"})
}

export const likePost = async (req: Request, res: Response) => {
    const {id} = req.params;

    const updated = await prisma.post.update({
        where:{id},
        data: {likes: {increment: 1}},
    })

    res.json(updated)
}