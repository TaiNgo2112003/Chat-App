import express from "express";
import axios from "axios";
import { protectRoute } from "../middleware/auth.middleware.js"
import { sendNotification} from "../controllers/call.controller.js";
const router = express.Router();

const DAILY_API_KEY = "17663ee607006f0ba87bfd138be50e89eb2d1dbc4cd0ab5f8339fb12b445cbaa";
const DAILY_BASE_URL = "https://api.daily.co/v1";

const dailyAPI = axios.create({
    baseURL: DAILY_BASE_URL,
    headers: {
        "Authorization": `Bearer ${DAILY_API_KEY}`,
        "Content-Type": "application/json"
    }
});

router.post("/call/:id", protectRoute,  sendNotification);
// Tạo room mới
router.post('/create-room', async (req, res) => {
    const { roomName } = req.body;

    try {
        console.log(`🔍 Kiểm tra phòng video: ${roomName}`);

        // 1️⃣ Kiểm tra xem phòng có tồn tại không
        const checkResponse = await axios.get(
            `${DAILY_BASE_URL}/rooms/${roomName}`,
            {
                headers: {
                    Authorization: `Bearer ${DAILY_API_KEY}`,
                },
            }
        );

        // 2️⃣ Nếu phòng tồn tại, trả về luôn thông tin phòng để vào
        console.log(`✅ Phòng đã tồn tại: ${roomName}`);
        return res.status(200).json({
            success: true,
            room: checkResponse.data,
        });
    } catch (checkError) {
        if (checkError.response?.status === 404) {
            // 3️⃣ Nếu phòng chưa tồn tại (404 Not Found), thì tạo mới
            console.log(`🔧 Phòng chưa tồn tại, đang tạo mới: ${roomName}`);

            const createResponse = await axios.post(
                `${DAILY_BASE_URL}/rooms`,
                {
                    name: roomName,
                    privacy: 'public',
                    properties: {
                        enable_chat: true,
                        enable_knocking: false,
                        exp: Math.floor(Date.now() / 1000) + 360, // hết hạn sau 1 giờ
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${DAILY_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Phòng video được tạo:', createResponse.data);

            return res.status(201).json({
                success: true,
                room: createResponse.data,
            });
        }

        // 4️⃣ Các lỗi khác (không phải 404) thì trả về lỗi
        console.error('❌ Lỗi khi kiểm tra/tạo phòng video:', checkError.response?.data || checkError.message);

        return res.status(500).json({
            success: false,
            message: 'Không thể kiểm tra/tạo phòng video',
            error: checkError.response?.data || checkError.message,
        });
    }
});















// Xóa room (tuỳ nếu bạn cần thêm chức năng này)
router.delete("/delete-room/:roomName", async (req, res) => {
    const { roomName } = req.params;

    try {
        console.log(`🚀 Xóa room ${roomName}...`);
        const response = await dailyAPI.delete(`/rooms/${roomName}`);
        console.log("✅ Room deleted:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("❌ Lỗi khi xóa room:", error.response?.data || error.message);
        res.status(500).json({ error: "Không thể xóa phòng Daily" });
    }
});

export default router;
