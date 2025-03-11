import { getReceiverSocketId, io } from "../lib/socket.js";

export const sendNotification = async (req, res) => {
    try {
        const { idRoom } = req.body; 
        const { id: receiverId } = req.params;
        const senderId = req.user.fullName;

        if (!idRoom || !receiverId || !senderId) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết!" });
        }
        const callVideoRequest = { senderId, receiverId, idRoom };
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("callVideoRequest: ",callVideoRequest)
        console.log("receiverSocketId: ",receiverSocketId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("callVideoRequest", callVideoRequest);
            console.log("callVideoRequest: ",callVideoRequest)
        } else {
            console.warn(`⚠️ Socket ID không tồn tại cho receiverId: ${receiverId}`);
        }

        res.json({ success: true, callVideoRequest });
    } catch (error) {
        console.error("❌ Lỗi khi gửi thông báo:", error);
        res.status(500).json({ message: "Lỗi server khi gửi thông báo" });
    }
};
