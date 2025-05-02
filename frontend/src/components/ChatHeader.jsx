import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useCallStore } from "../store/useCallStore";
import { createDailyRoom } from "../services/dailyService";
import VideoCall from "./VideoCall";
import Mark from "mark.js";

import {
  PhoneIcon,
  VideoCameraIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { socket, authUser, onlineUsers } = useAuthStore();
  const {
    notification,
    users,
    selectedUserCall,
    isUsersLoading,
    subscribeToCall,
    unsubscribeFromCall,
    setSelectedUserCall,
    sendNotification,
  } = useCallStore();

  const [roomUrl, setRoomUrl] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  const authUserId = authUser.user?._id || authUser._id;
  const authUserName = authUser.user?.fullName || authUser.fullName;
  const selectedUserId = selectedUser?._id;
  const roomId = authUserId && selectedUserId ? [authUserId, selectedUserId].sort().join("") : null;

  useEffect(() => {
    if (selectedUserCall && selectedUserId) subscribeToCall();
    return () => unsubscribeFromCall();
  }, [selectedUserCall, selectedUserId, subscribeToCall, unsubscribeFromCall]);

  useEffect(() => {
    subscribeToCall();
    return () => unsubscribeFromCall();
  }, []);

  const handleVideoCall = async () => {
    if (!authUserId || !selectedUserId) {
      console.error("🚨 Thiếu thông tin người dùng, không thể gọi video.");
      alert("Lỗi: Người dùng không hợp lệ.");
      return;
    }
    try {
      setSelectedUserCall(selectedUser);
      const room = await createDailyRoom(roomId);
      setRoomUrl(room.url);
      setIsCalling(true);
      await sendNotification({ idRoom: room.url });

      if (socket) {
        socket.emit("callVideoRequest", {
          senderId: authUserName,
          receiverId: selectedUserId,
          idRoom: room.url,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo phòng hoặc gửi thông báo:", error);
      alert("Không thể tạo phòng hoặc gửi thông báo.");
    }
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setRoomUrl("");
  };

  const openFindInChat = () => {
    // Nhập từ khóa tìm kiếm từ người dùng
    const keyword = prompt("🔍 Nhập từ khóa cần tìm:");
  
    if (!keyword) return; // Nếu không nhập gì thì thoát
  
    // Chọn phần nội dung chat (đổi `#chat-container` thành id thực tế)
    const chatContainer = document.getElementById("chat-container");
  
    if (!chatContainer) {
      toast.error("Không tìm thấy vùng chat!");
      return;
    }
  
    // Xóa highlight cũ trước khi tìm kiếm mới
    const markInstance = new Mark(chatContainer);
    markInstance.unmark({
      done: () => {
        // Đánh dấu từ khóa mới
        markInstance.mark(keyword, {
          separateWordSearch: false,
          className: "highlighted-text", // Áp dụng CSS
          done: () => {
            // Tìm phần tử đầu tiên được highlight
            const firstHighlighted = chatContainer.querySelector(".highlighted-text");
            if (firstHighlighted) {
              firstHighlighted.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
              toast.error("Không tìm thấy kết quả.");
            }
          },
        });
      },
    });
  };
  

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleVideoCall}
            className="btn btn-sm btn-secondary flex items-center gap-1"
            title="Video Call"
          >
            <VideoCameraIcon className="w-5 h-5" /> Gọi Video
          </button>

          {isCalling && roomUrl && <VideoCall roomUrl={roomUrl} onCallEnd={handleEndCall} />}

          <button
            onClick={openFindInChat}
            className="btn btn-sm btn-accent flex items-center gap-1"
            title="Find in Chat"
          >
            <MagnifyingGlassIcon className="w-5 h-5" /> Find
          </button>

          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-sm btn-ghost flex items-center gap-1"
            title="Close"
          >
            <XMarkIcon className="w-5 h-5" /> Close
          </button>
        </div>
      </div>
    </div>

  );

};

export default ChatHeader;
