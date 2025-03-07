import express from "express";
import axios from "axios";

const router = express.Router();

const DAILY_API_KEY = "17663ee607006f0ba87bfd138be50e89eb2d1dbc4cd0ab5f8339fb12b445cbaa"; // Thay bằng API key thật của bạn
const DAILY_BASE_URL = "https://api.daily.co/v1";

const dailyAPI = axios.create({
    baseURL: DAILY_BASE_URL,
    headers: {
        "Authorization": `Bearer ${DAILY_API_KEY}`,
        "Content-Type": "application/json"
    }
});

// Tạo room mới
router.post("/create-room", async (req, res) => {
    const { roomName } = req.body;

    try {
        console.log(`🔧 Đang tạo phòng video: ${roomName}`);

        const response = await axios.post(
            `${DAILY_BASE_URL}/rooms`,
            {
                name: roomName,
                privacy: 'public',
                properties: {
                    enable_chat: true,
                    enable_knocking: false,
                    exp: Math.floor(Date.now() / 1000) + 300,  // 1 tiếng
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${DAILY_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('✅ Phòng video được tạo:', response.data);

        res.status(200).json({
            success: true,
            room: response.data,
        });
    } catch (error) {
        console.error('❌ Lỗi khi tạo phòng video:', error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: 'Không thể tạo phòng video',
            error: error.response?.data || error.message,
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
