import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

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

export const getAllPosts = async(_:Request, res: Response) =>{
    const posts = await prisma.post.findMany({
        include:{author: {select: {username: true}}},
        orderBy: {createdAt: "desc"}
    });
    res.json(posts);
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