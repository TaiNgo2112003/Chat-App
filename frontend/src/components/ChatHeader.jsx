import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { PhoneIcon, VideoCameraIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();


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
            onClick={() => openFindInChat()}
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
}
  export default ChatHeader;