import express from "express";
import {purchaseCloudPackage, getMyCloud } from "../controllers/clound.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/purchase", protectRoute, purchaseCloudPackage);
router.get("/me/cloud", protectRoute, getMyCloud);
export default router;
