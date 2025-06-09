import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const addComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = (req as any).user.id;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });
     res.status(201).json(comment);
     return
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const limit = parseInt(req.params.limit as string) || 10;
  const skip = parseInt(req.query.skip as string) || 0;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};


export const deleteComment = async (req: Request, res: Response) => {
    const {commentId} = req.params;
    const userId = (req as any).user.id;

    try {
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });

        if(!comment || comment.userId != userId){
            res.status(403).json({msg: "Unauthorized or comment not found"})
            return;
        }
        
        await prisma.comment.delete({where: {id: commentId}});
        res.status(200).json({msg: "Comment deleted"});

    } catch (error) {
            res.status(500).json({ message: "Error deleting comment", error });

    }
}