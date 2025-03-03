import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/create-image", async (req, res) => {
  console.log("\uD83D\uDCE2 Nhận request tạo ảnh"); // ✅ Debug log
  const { text, resolution } = req.body;
  const validSizes = ["256x256", "1024x1024"]; // Chỉ hỗ trợ kích thước hợp lệ
  
  if (!text || !resolution) {
    console.error("❌ Lỗi: Thiếu dữ liệu đầu vào");
    return res.status(400).json({ error: "Thiếu dữ liệu đầu vào" });
  }
  
  if (!validSizes.includes(resolution)) {
    console.error("❌ Lỗi: Kích thước ảnh không hợp lệ");
    return res.status(400).json({ error: "Kích thước ảnh không hợp lệ. Chỉ hỗ trợ 256x256, 1024x1024." });
  }

  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/image/generation",
    headers: {
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjlmYzkzMzctZGQyNi00OTUwLWFjNmYtNjhmMDFmY2YwNTE1IiwidHlwZSI6ImFwaV90b2tlbiJ9.ZJKs2Kolu6pm7PsScMD0cWLl0g0-fHpgJdqg4b2P3fM",
      "Content-Type": "application/json",
    },
    data: {
      providers: "openai",
      text,
      resolution,
    },
  };

  try {
    console.log("\uD83D\uDE80 Gửi request tới EdenAI...");
    const response = await axios.request(options);
    console.log("✅ Ảnh tạo thành công:", JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error("❌ Lỗi khi tạo ảnh:", error.response?.data || error.message);
    res.status(500).json({ error: "Không thể tạo ảnh" });
  }
});

export default router;
