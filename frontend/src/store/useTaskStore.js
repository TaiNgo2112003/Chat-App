import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,

  // Lấy danh sách task của user hiện tại
  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/tasks`);
      set({
        tasks: Array.isArray(response.data) ? response.data : [],
        isLoading: false
      });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to fetch tasks");
      set({ isLoading: false });
    }
  },
    // Xóa task
    deleteTask: async (taskId) => {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        set({ tasks: get().tasks.filter(task => task._id !== taskId) });
        toast.success("Task deleted successfully!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete task");
      }
    },
  // Tạo task mới
  createTask: async (taskData) => {
    try {
      const authUser = useAuthStore.getState().authUser;
      const userId = authUser?.user?._id || authUser?._id;
      console.log("user id in task store: ", userId);
      if (!userId) {
        toast.error("User not authenticated.");
        return;
      }

      const res = await axiosInstance.post(`/tasks`, taskData, { withCredentials: true });

      set({ tasks: [...get().tasks, res.data] });
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  },



  // Cập nhật task (ví dụ: đổi trạng thái hoàn thành)
  updateTask: async (taskId, updates) => {
    try {
      const res = await axiosInstance.put(`/tasks/${taskId}`, updates);
      set({
        tasks: get().tasks.map(task =>
          task._id === taskId ? res.data : task
        ),
      });
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  },
}));
