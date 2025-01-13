import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloundianry from "../lib/cloudinary.js"
import uploadFile from '../lib/filebase.js'; // Nhập hàm uploadFile từ filebase.js
import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image, file } = req.body; // Lấy text và image từ body
        const { id: receiverId } = req.params; // Lấy receiverId từ URL params
        const senderId = req.user._id; // Lấy senderId từ user đã đăng nhập

        let imageURL;
        if (image) {
            const uploadResponse = await cloundianry.uploader.upload(image);
            imageURL = uploadResponse.secure_url; // Lưu URL của ảnh từ Cloudinary
        }

        let fileURL;
        if (req.file) {
            console.log("File received in controller:", req.file); // Kiểm tra multer đã thêm file vào req chưa
            const { buffer, originalname } = req.file; // Nếu req.file tồn tại nhưng buffer undefined => cấu trúc file không đúng
            const fileUploadResponse = await uploadFile(buffer, originalname); // Upload file lên Filebase
            fileURL = fileUploadResponse.fileUrl; // Lấy URL của file đã upload
        }
        // Tạo tin nhắn mới
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
            file: fileURL, // Gán URL file nếu có
        });
        console.log("receiverId: ", receiverId);
        await newMessage.save(); // Lưu tin nhắn vào cơ sở dữ liệu
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("receiverSocketId in message.controller: ", receiverSocketId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        } else {
            console.warn(`Socket ID not found for receiverId: ${receiverId}`);
        }

        res.status(201).json(newMessage); // Trả về tin nhắn vừa tạo
    } catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
