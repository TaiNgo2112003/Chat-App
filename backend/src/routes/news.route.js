import express from "express";
import {getNews} from "../controllers/news.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/news", protectRoute, getNews);
export default router;
