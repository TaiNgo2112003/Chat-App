import express from "express";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const API_KEY = process.env.WITHOUTBG || "BQejd4mfY9XU2fw8mtQpzYfi";

router.post("/remove-background", upload.single("file"), async (req, res) => {
  const imageUrl = req.body.image_url;
  const file = req.file;

  if (!imageUrl && !file) {
    return res.status(400).json({ error: "Thiếu URL hoặc file ảnh" });
  }

  try {
    let resp;
    const form = new FormData();
    form.append("size", "auto");

    if (file) {
      form.append("image_file", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    } else {
      form.append("image_url", imageUrl);
    }

    const headers = {
      "X-Api-Key": API_KEY,
      ...form.getHeaders(),
    };

    resp = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      form,
      { headers, responseType: "arraybuffer", maxBodyLength: Infinity, maxContentLength: Infinity }
    );

    const base64 = Buffer.from(resp.data, "binary").toString("base64");
    const mimeType = resp.headers["content-type"] || "image/png";
    const resultUrl = `data:${mimeType};base64,${base64}`;

    return res.json({ result_url: resultUrl });
  } catch (err) {
    let details = err.message;
    if (err.response) {
      if (Buffer.isBuffer(err.response.data)) {
        try {
          details = JSON.parse(err.response.data.toString("utf8"));
        } catch (e) {
          details = err.response.data.toString("utf8");
        }
      } else {
        details = err.response.data;
      }
    }
    return res.status(500).json({ error: "Không thể xử lý ảnh", details });
  }
});

export default router;
