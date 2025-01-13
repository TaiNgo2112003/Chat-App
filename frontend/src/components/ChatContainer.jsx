import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  // State and store hooks
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  console.log("authUser lè: ", authUser.user.fullName);
  // Fetch messages and set up subscription
  useEffect(() => {
    if (selectedUser && selectedUser._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to the latest message when messages update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to handle options
  const handleOptionClick = (option, message) => {
    switch (option) {
      case "reply":
        console.log("Reply to:", message);
        break;
      case "copy":
        navigator.clipboard.writeText(message.text || "");
        console.log("Copied:", message.text);
        break;
      case "save":
        if (message.image) {
          const link = document.createElement("a");
          link.href = message.image;
          link.download = "image.jpg";
          link.click();
        }
        break;
      default:
        break;
    }
  };

  // Loading state
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  // Main chat UI
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            {/* Header with timestamp and sender's name */}
            <div className="chat-header mb-1 flex items-center">
              <span className="font-bold text-sm">
                {message.senderId === authUser._id ? "You" : selectedUser.fullName}
              </span>
              <time className="text-xs opacity-50 ml-2">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Chat Bubble with Options */}
            <div className="chat-bubble flex flex-col relative group">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}

              {/* Options Button */}
              <div className="absolute top-0 right-0 mt-2 mr-2 hidden group-hover:flex items-center justify-center">
                <button
                  className="p-1 rounded-full hover:bg-gray-200"
                  onClick={() => console.log("Options clicked")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {/* Dropdown */}
                <div className="absolute top-6 right-0 w-24 bg-white shadow-lg rounded-md text-sm">
                  <button
                    className="w-full px-2 py-1 hover:bg-gray-100"
                    onClick={() => handleOptionClick("reply", message)}
                  >
                    Reply
                  </button>
                  <button
                    className="w-full px-2 py-1 hover:bg-gray-100"
                    onClick={() => handleOptionClick("copy", message)}
                  >
                    Copy
                  </button>
                  {message.image && (
                    <button
                      className="w-full px-2 py-1 hover:bg-gray-100"
                      onClick={() => handleOptionClick("save", message)}
                    >
                      Save Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
