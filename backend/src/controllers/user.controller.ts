import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getMe = async ( req: Request, res: Response) =>{
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({where: {id : userId}});

    if(!user){
        res.status(404).json({msg : "User not found"});
        return;
    }

    res.json(user);
    return;
}

export const updateProfile = async( req: Request, res: Response) =>{
    const userId = (req as any).user.id;
    const {bio} = req.body;

    const updated = await prisma.user.update({
        where: {id: userId},
        data : {bio},
    })

    res.json(updated);
    return;
}