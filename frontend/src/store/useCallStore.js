import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import React from "react"; // Import để dùng React.createElement
import { axiosInstance } from "../lib/axios";

const acceptCall = (callVideoRequest, toastId) => {
  toast.dismiss(toastId); // Ẩn thông báo

  // Tạo div cho modal
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.background = "rgba(0,0,0,0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";

  // Tạo container chứa iframe
  const container = document.createElement("div");
  container.style.width = "80vw";
  container.style.height = "80vh";
  container.style.background = "white";
  container.style.borderRadius = "8px";
  container.style.overflow = "hidden";
  container.style.position = "relative";

  // Tạo iframe hiển thị cuộc gọi video
  const iframe = document.createElement("iframe");
  iframe.src = callVideoRequest.idRoom;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.allow = "camera; microphone; fullscreen";

  // Tạo nút đóng modal
  const closeButton = document.createElement("button");
  closeButton.innerText = "❌ Đóng";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.background = "red";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.padding = "5px 10px";
  closeButton.style.cursor = "pointer";
  closeButton.style.borderRadius = "4px";

  closeButton.onclick = () => {
    document.body.removeChild(modal);
  };

  // Thêm các thành phần vào modal
  container.appendChild(iframe);
  container.appendChild(closeButton);
  modal.appendChild(container);
  document.body.appendChild(modal);
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
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("callVideoRequest", (callVideoRequest) => {
      console.log("📩 Nhận sự kiện callVideoRequest:", callVideoRequest);

      const { senderId, idRoom } = callVideoRequest;
      const authUserId = useAuthStore.getState().authUser?._id;

      if (!authUserId || senderId === authUserId) return;

      set((state) => ({
        notification: [...state.notification, callVideoRequest],
      }));

      // ✅ Hiển thị toast notification
      toast.custom((t) =>
        React.createElement(
          "div",
          { style: { background: "white", padding: "10px", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" } },
          React.createElement("p", { style: { fontSize: "16px", fontWeight: "bold" } }, `📞 Cuộc gọi từ ${senderId}`),
          React.createElement(
            "div",
            { style: { display: "flex", gap: "10px", marginTop: "10px" } },
            React.createElement(
              "button",
              {
                style: { background: "green", color: "white", padding: "5px 10px", borderRadius: "4px" },
                onClick: () => acceptCall(callVideoRequest, t.id)
              },
              "✅ Chấp nhận"
            ),
            React.createElement(
              "button",
              {
                style: { background: "red", color: "white", padding: "5px 10px", borderRadius: "4px" },
                onClick: () => toast.dismiss(t.id)
              },
              "❌ Từ chối"
            )
          )
        )
      );
    });
  },

  unsubscribeFromCall: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("callVideoRequest");
    }
  },
}));
