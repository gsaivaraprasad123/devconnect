import { PrismaClient } from "@prisma/client";
import e, { Request, Response } from "express";

const prisma = new PrismaClient();

export const bookmarkPost = async (req: Request, res : Response) => {
    const userId = (req as any).user.id;
    const postId = req.params.postId;

    try {
        await prisma.bookmark.create({
            data:{
                userId,
                postId,
            }
        })
        res.status(201).json({msg: "Post bookmarked"})
    } catch (err) {
       res.status(400).json({msg: "Post already bookmaked or invalid"}) 
    }
}

export const unbookmarkPost = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const postId = req.params.postId;

    await prisma.bookmark.deleteMany({
        where:{userId, postId}
    })

    res.json({msg: "Bookmark removed"});
}

export const getBookmarkedPosts = async (req: Request, res: Response) =>{
    const userId = (req as any).user.id;

    const bookmarks = await prisma.bookmark.findMany({
        where:{userId},
        include:{
            post:{
                include:{
                    author: true
                }
            }
        }
    });

    const posts = bookmarks.map((b) => b.post);
    res.json(posts);
}