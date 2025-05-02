import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js"; // Middleware upload file
import { getPosts, createPost, createComment, reactToPost } from "../controllers/post.controller.js";
import uploadFields from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getPosts);
router.post("/create", protectRoute, uploadFields, createPost);
router.post("/:postId/comments", protectRoute, createComment);
router.post("/:postId/react", protectRoute, reactToPost);

export default router;
