import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path"

import authRoutes from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "50mb" })); // Tăng giới hạn JSON
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Cho form-urlencoded
app.use(cookieParser()); // Để xử lý cookie
app.use(cors({
    origin: "http://localhost:5173", // Client
    credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
}
app.get("*", (req, res) => {
    res.sendFile(path.join(path.join(__dirname, "../frontend", "dist", "index.html")));
})
// Server khởi chạy
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
});