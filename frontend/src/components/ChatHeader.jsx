import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { PhoneIcon, VideoCameraIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import React, { useEffect } from 'react';

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, socket, authUser } = useAuthStore();

  const initiateCall = (receiverId) => {
    if (!authUser || !selectedUser) {
      toast.error("Vui lòng chọn người dùng trước khi gọi.");
      return;
    }

    if (socket) {
      socket.emit('callUser', {
        callerId: authUser._id,
        receiverId: receiverId,
        callerName: authUser.fullName  // Gửi thêm tên đầy đủ
      });

      toast.success(`📞 Đang gọi tới ${selectedUser.fullName}...`);
    } else {
      toast.error("Socket chưa sẵn sàng, vui lòng thử lại.");
    }
  };

  // Placeholder cho video call (bạn cần implement sau)
  const initiateVideoCall = (receiverId) => {
    toast('📹 Video call chưa được hỗ trợ.');
  };

  // Placeholder cho tìm kiếm trong chat (bạn cần implement sau)
  const openFindInChat = () => {
    toast('🔍 Tính năng tìm kiếm chưa được hỗ trợ.');
  };

  useEffect(() => {
    if (!socket) return;

    const handleCallAccepted = () => {
      toast.success(`${selectedUser.fullName} đã chấp nhận cuộc gọi!`);
      // TODO: Chuyển sang giao diện gọi thực sự (WebRTC)
    };

    const handleCallRefused = () => {
      toast.error(`${selectedUser.fullName} đã từ chối cuộc gọi.`);
    };

    socket.on("callAccepted", handleCallAccepted);
    socket.on("callRefused", handleCallRefused);

    return () => {
      socket.off("callAccepted", handleCallAccepted);
      socket.off("callRefused", handleCallRefused);
    };
  }, [selectedUser, socket]);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Call Button */}
          <button
            onClick={() => initiateCall(selectedUser._id)}
            className="btn btn-sm btn-primary flex items-center gap-1"
            title="Call"
          >
            <PhoneIcon className="w-5 h-5" />
            Call
          </button>

          {/* Video Call Button */}
          <button
            onClick={() => initiateVideoCall(selectedUser._id)}
            className="btn btn-sm btn-secondary flex items-center gap-1"
            title="Video Call"
          >
            <VideoCameraIcon className="w-5 h-5" />
            Video
          </button>

          {/* Find in Chat Button */}
          <button
            onClick={openFindInChat}
            className="btn btn-sm btn-accent flex items-center gap-1"
            title="Find in Chat"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            Find
          </button>

          {/* Close Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-sm btn-ghost flex items-center gap-1"
            title="Close"
          >
            <XMarkIcon className="w-5 h-5" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
