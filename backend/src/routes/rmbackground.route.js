import express from "express";
import axios from "axios";
import cloudinary from "../lib/cloudinary.js"; // NEW: upload data URI if needed

const router = express.Router();

const API_KEY = process.env.PIXELCUT_API_KEY || "sk_5a72a5f18ebc46508c81abbc54b76726"; // prefer env var

router.post("/remove-background", async (req, res) => {
    let { image_url } = req.body;

    if (!image_url) {
        console.error("❌ Lỗi: Thiếu URL ảnh đầu vào");
        return res.status(400).json({ error: "Thiếu URL ảnh" });
    }

    // If frontend sent a data URI (base64), upload to Cloudinary first
    try {
        if (typeof image_url === "string" && image_url.startsWith("data:")) {
            const uploadResponse = await cloudinary.uploader.upload(image_url, {
                resource_type: "image",
            });
            image_url = uploadResponse.secure_url;
            console.log("Uploaded data URI to Cloudinary:", image_url);
        } else {
            // Quick reachability check for external URLs
            try {
                const head = await axios.head(image_url, { timeout: 5000 });
                if (head.status >= 400) {
                    throw new Error("Unreachable image URL");
                }
            } catch (err) {
                console.error("Image URL not reachable:", err.message);
                return res.status(400).json({ error: "Invalid or unreachable image URL" });
            }
        }
    } catch (err) {
        console.error("Error preparing image URL:", err.response?.data || err.message || err);
        return res.status(500).json({ error: "Không thể xử lý ảnh đầu vào" });
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
