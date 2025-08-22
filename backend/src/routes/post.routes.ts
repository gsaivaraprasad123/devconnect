import { Router } from "express";
import { createPost, deletePost, getAllPosts, likePost, updatePost } from "../controllers/post.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router =  Router();

router.get("/", getAllPosts);
router.post("/", authenticateToken, createPost);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);
router.post("/:id/like", authenticateToken, likePost)

export default router; 
