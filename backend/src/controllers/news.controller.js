import express from "express";
import axios from "axios";

const router = express.Router();
const API_KEY = process.env.NEWSKEY;

export const getNews = async (req, res) => {
  try {
    const { pageSize = 10, page = 1, q } = req.query;

    const response = await axios.get(
      "https://newsapi.org/v2/top-headlines",
      {
        params: {
          category: "general", // chỉ general
          pageSize,
          page,
          q, // optional search keyword
        },
        headers: { "X-Api-Key": API_KEY },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ Lỗi lấy tin tức:", err.response?.data || err.message);
    res.status(500).json({ error: "Không thể lấy tin tức" });
  }
};

router.get("/news", getNews);

export default router;
