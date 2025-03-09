import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// ✅ Hàm acceptCall để mở phòng họp video
const acceptCall = (callVideoRequest, toastId) => {
  toast.dismiss(toastId); // Ẩn thông báo
  window.open(callVideoRequest.roomUrl, "_blank"); // Mở link cuộc gọi
};

export const useCallStore = create((set, get) => ({
  notification: [],
  users: [],
  selectedUserCall: null,
  isUsersLoading: false,
  setSelectedUserCall: (selectedUserCall) => set({ selectedUserCall }),

  sendNotification: async (notificationData) => {
    const { selectedUserCall, notification } = get();
    
    if (!selectedUserCall || !selectedUserCall._id) {
      console.error("❌ Lỗi: selectedUserCall._id bị undefined!");
      return;
    }
  
    try {
      const res = await axiosInstance.post(`/call/call/${selectedUserCall._id}`, notificationData);
      
      console.log("✅ Notification response:", res.data);
      set({ notification: [...notification, res.data] });
    } catch (error) {
      console.error("❌ Lỗi khi gửi thông báo:", error);
      toast.error(error.response?.data?.message || "Gửi thông báo thất bại");
    }
  },
  

  subscribeToCall: () => {
    const { selectedUserCall } = get();
    if (!selectedUserCall) return;
    const socket = useAuthStore.getState().socket;
    console.log("socket", socket);

    socket.on("callVideoRequest", (callVideoRequest) => {
      const iscallVideoRequestFromselectedUserCall = callVideoRequest.senderId === selectedUserCall._id;
      if (!iscallVideoRequestFromselectedUserCall) return;

      set({
        notification: [...get().notification, callVideoRequest],
      });

      // ✅ Hiển thị thông báo cuộc gọi video
      toast.custom((t) => (
        React.createElement("div", null,
          React.createElement("p", null, `📞 ${callVideoRequest.senderId} đang gọi...`),
          React.createElement("button", { onClick: () => acceptCall(callVideoRequest, t.id) }, "✅ Chấp nhận"),
          React.createElement("button", { onClick: () => toast.dismiss(t.id) }, "❌ Từ chối")
        )
      ));

    });
  },

  unsubscribeFromCall: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("callVideoRequest");
  },
}));
