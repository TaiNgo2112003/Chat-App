import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const usePostStore = create((set, get) => ({
  posts: [],
  isPostsLoading: false,

  // Lấy danh sách bài viết
  getPosts: async () => {
    set({ isPostsLoading: true });
    try {
      const res = await axiosInstance.get("/posts");
      set({ posts: res.data });
      console.log("data in posts: ", res.data)
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message || "Đã xảy ra lỗi.";

        if (status === 500) {
          toast.error("Lỗi server (500): Vui lòng thử lại sau.");
        } else {
          toast.error(`Lỗi (${status}): ${message}`);
        }
      } else if (error.request) {
        toast.error("Không thể kết nối đến server. Kiểm tra mạng của bạn.");
      } else {
        toast.error(`Lỗi: ${error.message}`);
      }
    } finally {
      set({ isPostsLoading: false });
    }
  },

  // Đăng bài viết mới
  createPost: async (postData) => {
    try {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "multipart/form-data" }, // QUAN TRỌNG: Định dạng dữ liệu
      });

      set({ posts: [res.data, ...get().posts] }); // Thêm bài viết mới vào đầu danh sách
      console.log("data in usePostStore: ", res.data)
      console.log("data in usePostStore: ", postData)
      toast.success("Bài viết đã được đăng!");
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error.response?.data || error.message); // Log lỗi chi tiết
      toast.error(error.response?.data?.message || "Lỗi khi đăng bài.");
    }
  },


  reactToPost: async (postId, reactionType) => {
    try {
      const res = await axiosInstance.post(`/posts/${postId}/react`, { reactionType });

      if (res.data.success) {
        const updatedPosts = get().posts.map((post) =>
          post._id === postId ? { ...post, reactions: res.data.reactions } : post
        );

        set({ posts: updatedPosts });
        toast.success("Bạn đã thả cảm xúc!");
      } else {
        toast.error("Không thể cập nhật cảm xúc.");
      }
    } catch (error) {
      console.error("Error in reactToPost:", error);
      toast.error("Không thể thả cảm xúc.");
    }
  },




  // Bình luận bài viết
  commentOnPost: async (postId, commentData) => {
    try {
      const res = await axiosInstance.post(`/posts/${postId}/comments`, commentData);

      const updatedPosts = get().posts.map((post) =>
        post._id === postId
          ? { ...post, comments: [...(post.comments || []), res.data] }
          : post
      );

      set({ posts: updatedPosts });
      toast.success("Bình luận đã được thêm!");
    } catch (error) {
      toast.error("Lỗi khi gửi bình luận.");
    }
  },

}));
