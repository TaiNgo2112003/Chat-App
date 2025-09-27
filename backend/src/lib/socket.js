
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://mobile-connection-web.vercel.app"],
  },
});

const userSocketMap = {}; 

export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && typeof userId === "string" && userId.trim() !== "") {
    userSocketMap[userId] = socket.id;
    console.log(`ℹ️ User ${userId} is now online`);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.warn(`⚠️ Socket ${socket.id} connected without a valid userId`);
  }

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);

    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
      console.log(`ℹ️ User ${userId} is now offline`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
