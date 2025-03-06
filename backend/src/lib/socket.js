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

// used to store online users
const userSocketMap = {}; // {userId: socketId}

// Utility function to get receiver's socket id
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// ====== SOCKET CONNECTION HANDLER ======
io.on("connection", (socket) => {
  console.log("✅ A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.warn(`⚠️ Socket ${socket.id} connected without userId`);
  }

  // ====== CALL HANDLING ======
  // socket.on("callUser", ({ callerId, receiverId, callerName }) => {
  //   const receiverSocketId = getReceiverSocketId(receiverId);
  //   if (receiverSocketId) {
  //     io.to(receiverSocketId).emit("incomingCall", { callerId, callerName });
  //     console.log(`📞 Call sent from ${callerId} to ${receiverId}`);
  //   } else {
  //     console.log(`⚠️ User ${receiverId} is not online.`);
  //   }
  // });

  // socket.on("acceptCall", ({ callerId, receiverId }) => {
  //   const callerSocketId = getReceiverSocketId(callerId);
  //   if (callerSocketId) {
  //     io.to(callerSocketId).emit("callAccepted", { receiverId });
  //     console.log(`✅ Call accepted by ${receiverId} for ${callerId}`);
  //   }
  // });

  // socket.on("refuseCall", ({ callerId, receiverId }) => {
  //   const callerSocketId = getReceiverSocketId(callerId);
  //   if (callerSocketId) {
  //     io.to(callerSocketId).emit("callRefused", { receiverId });
  //     console.log(`❌ Call refused by ${receiverId} for ${callerId}`);
  //   }
  // });

  // ====== WEBRTC HANDLING ======
  // socket.on('offer', async ({ offer }) => {
  //   try {
  //     const peerConnection = new RTCPeerConnection({
  //       iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  //     });

  //     const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //     localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  //     useRTCStore.getState().setPeerConnection(peerConnection);
  //     useRTCStore.getState().setLocalStream(localStream);

  //     await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  //     const answer = await peerConnection.createAnswer();
  //     await peerConnection.setLocalDescription(answer);

  //     socket.emit('answer', { answer, callerId: incomingCall?.callerId });

  //     peerConnection.onicecandidate = (event) => {
  //       if (event.candidate) {
  //         socket.emit('iceCandidate', {
  //           candidate: event.candidate,
  //           callerId: incomingCall?.callerId
  //         });
  //       }
  //     };
  //   } catch (error) {
  //     console.error("Error handling offer:", error);
  //   }
  // });

  // socket.on('answer', async ({ answer }) => {
  //   const peerConnection = useRTCStore.getState().peerConnection;
  //   if (peerConnection) {
  //     await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  //   }
  // });

  // socket.on('iceCandidate', ({ candidate }) => {
  //   const peerConnection = useRTCStore.getState().peerConnection;
  //   if (peerConnection) {
  //     peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  //   }
  // });

  // ====== DISCONNECT HANDLING ======
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
