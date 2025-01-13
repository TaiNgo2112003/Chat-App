import express from "express";
import { login, logout, signup, checkAuth, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Sử dụng phương thức POST cho signup
router.post("/signup", signup);

// Sử dụng phương thức POST cho login
router.post("/login", login);

// Sử dụng phương thức POST hoặc GET cho logout tùy theo thiết kế
router.post("/logout", logout);

router.put("/update-profile",protectRoute, updateProfile)

router.get("/check", protectRoute, checkAuth);


export default router;
