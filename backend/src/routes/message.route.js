import express from "express"

import { protectRoute } from "../middleware/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import upload from "../middleware/upload.middleware.js"; // Import middleware Multer
import uploadFields from "../middleware/upload.middleware.js";

// Cấu hình Multer
const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, uploadFields, sendMessage);



export default router;