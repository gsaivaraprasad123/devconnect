import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { bookmarkPost, getBookmarkedPosts, unbookmarkPost } from "../controllers/bookmark.controller";

const router = Router();

router.post('/:postId/bookmark', authenticateToken, bookmarkPost);
router.delete('/:postId/bookmark', authenticateToken, unbookmarkPost);
router.get('/me/bookmarks', authenticateToken, getBookmarkedPosts);


export default router;