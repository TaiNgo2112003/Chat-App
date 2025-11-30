import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useNewsStore = create((set, get) => ({
  articles: [],
  isLoading: false,
  page: 1,
  pageSize: 10,
  totalResults: 0,
  query: "",

  getNews: async (opts = {}) => {
    try {
      set({ isLoading: true });

      const page = opts.page || get().page;
      const pageSize = opts.pageSize || get().pageSize;
      const query = typeof opts.query !== "undefined" ? opts.query : get().query;

      const res = await axiosInstance.get("/news/news", {
        params: { page, pageSize, q: query },
      });

      const data = res.data || {};
      const articles = data.articles || [];
      const totalResults = data.totalResults || 0;

      set({ articles, totalResults, page, pageSize, query });
    } catch (err) {
      console.error("Error fetching news:", err);
      toast.error("Không thể tải tin tức.");
    } finally {
      set({ isLoading: false });
    }
  },

  refresh: async () => {
    await get().getNews();
  },

  setPage: async (page) => {
    await get().getNews({ page });
  },

  setPageSize: async (pageSize) => {
    await get().getNews({ pageSize, page: 1 });
  },

  setQuery: async (query) => {
    await get().getNews({ query, page: 1 });
  },
}));
