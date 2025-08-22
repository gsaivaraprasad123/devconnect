import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { addComment, deleteComment, getComments } from "../controllers/comment .controller";

const router =  Router();


router.post("/posts/:postId/comments", authenticateToken, addComment);
router.get("/posts/:postId/comments", getComments);
router.delete("/comments/:commentId", authenticateToken, deleteComment);

export default router;