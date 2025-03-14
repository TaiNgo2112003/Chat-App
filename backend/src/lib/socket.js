// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//   },
// });

// // used to store online users
// const userSocketMap = {}; // {userId: socketId}

// // Utility function to get receiver's socket id
// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// // ====== SOCKET CONNECTION HANDLER ======
// io.on("connection", (socket) => {
//   console.log("✅ A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     userSocketMap[userId] = socket.id;
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   } else {
//     console.warn(`⚠️ Socket ${socket.id} connected without userId`);
//   }


//   // ====== DISCONNECT HANDLING ======
//   socket.on("disconnect", () => {
//     console.log("❌ A user disconnected", socket.id);
//     if (userId) delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Lưu trữ người dùng trực tuyến
const userSocketMap = {}; // {userId: socketId}

// Hàm lấy socketId của người nhận
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
