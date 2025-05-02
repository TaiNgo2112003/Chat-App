import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      if (error.response) {
        // Nếu có response từ server
        const status = error.response.status;
        const message = error.response.data.message || "An error occurred.";

        if (status === 500) {
          toast.error("Internal Server Error (500): Something went wrong on the server.");
        } else {
          toast.error(`Error (${status}): ${message}`);
        }
      } else if (error.request) {
        // Nếu không có phản hồi từ server
        toast.error("No response from the server. Please check your network connection.");
      } else {
        // Lỗi khác
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      console.log("data: ", res.data)

    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isMessagesLoading: false }); 
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      console.log("messageData", messageData)
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    console.log("socket", socket);
    //Store.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));