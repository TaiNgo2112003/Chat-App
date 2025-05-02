import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path"

import authRoutes from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import removebg from "./routes/rmbackground.route.js"
import createim from "./routes/createim.route.js"
import taskRouter from "./routes/taskRoutes.route.js"
import callVideo from "./routes/callVideo.route.js"
import postContent from "./routes/post.route.js"
import { app, server } from "./lib/socket.js";
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "100mb" })); // Tăng giới hạn JSON
app.use(express.urlencoded({ limit: "100mb", extended: true })); // Cho form-urlencoded
app.use(cookieParser()); // Để xử lý cookie
app.use(cors({
    origin: "http://localhost:5173", // Client
    credentials: true,
}));
app.use("/api/ai", removebg); // Định tuyến API AI
app.use("/api/ai", createim);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);
app.use("/api/tasks", taskRouter);
app.use("/api/call", callVideo);
app.use("/api/posts",postContent )

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