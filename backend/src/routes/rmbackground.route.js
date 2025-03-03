import express from "express"
import axios from "axios";
const router = express.Router();

const API_KEY = "sk_5a72a5f18ebc46508c81abbc54b76726"; // Thay API key của bạn

// Route xử lý xóa nền ảnh
router.post("/remove-background", async (req, res) => {
    try {
        const { image_url } = req.body;
        if (!image_url) {
            return res.status(400).json({ error: "Thiếu URL ảnh" });
        }

        const response = await axios.post(
            "https://api.developer.pixelcut.ai/v1/remove-background",
            { image_url, format: "png" },
            {
                headers: {
                    "X-API-KEY": API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Lỗi API Pixelcut:", error.response?.data || error.message);
        res.status(500).json({ error: "Lỗi khi gọi API Pixelcut" });
    }
});

export default router;