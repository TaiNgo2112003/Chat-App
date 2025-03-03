import express from "express";
import axios from "axios";

const router = express.Router();

const API_KEY = "sk_5a72a5f18ebc46508c81abbc54b76726"; // Thay bằng API key thật của bạn

router.post("/remove-background", async (req, res) => {
    const { image_url } = req.body;

    if (!image_url) {
        console.error("❌ Lỗi: Thiếu URL ảnh đầu vào");
        return res.status(400).json({ error: "Thiếu URL ảnh" });
    }

    const options = {
        method: "POST",
        url: "https://api.developer.pixelcut.ai/v1/remove-background",
        headers: {
            "X-API-KEY": API_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        data: {
            image_url,
            format: "png"
        }
    };

    try {
        console.log("🚀 Gửi request tới Pixelcut...");
        const response = await axios.request(options);
        console.log("✅ Xóa nền thành công:", JSON.stringify(response.data, null, 2));
        res.json(response.data);
    } catch (error) {
        console.error("❌ Lỗi khi gọi Pixelcut API:", error.response?.data || error.message);
        res.status(500).json({ error: "Không thể xóa nền ảnh" });
    }
});

export default router;
