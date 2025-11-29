import express from "express";
import { createOrder } from "../controllers/zalopay.controller.js";

const router = express.Router();

router.post("/create-order", express.json(), createOrder);

export default router;
