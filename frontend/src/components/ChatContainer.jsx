import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { AiOutlineFileWord, AiOutlineFilePdf, AiOutlineFile, AiFillFileExcel } from "react-icons/ai";
import axios from "axios";
import { saveAs } from "file-saver";

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
  const downloadFile = (fileName) => {
    const fileUrl = `/files/${fileName}`; // Đường dẫn file trong thư mục public
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName; // Đặt tên file khi tải xuống
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Main chat UI
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages List */}
      <div id="chat-container" className="flex-1 overflow-y-auto p-4 space-y-4">
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
              {message.text && (
                <>
                  {message.text.startsWith("Location: https://maps.google.com/?q=") ? (
                    <div className="flex flex-col items-start p-2 border rounded-lg bg-slate-600 mt-2">
                      {/* Lấy link Google Maps */}
                      <a
                        href={message.text.replace("Location: ", "").trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm font-semibold hover:underline"
                      >
                        📍 Xem trên Google Maps
                      </a>

                      {/* Hiển thị iframe Google Maps */}
                      <iframe
                        src={message.text.replace("Location: ", "").trim() + "&output=embed"}
                        width="250"
                        height="200"
                        style={{ border: 0, marginTop: "5px" }}
                        allowFullScreen=""
                        loading="lazy"
                      ></iframe>
                    </div>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </>
              )}
              {message.file && (
                <div className="flex items-center p-2 border rounded-lg bg-slate-600 mt-2">
                  {console.log("🔗 File URL:", `https://ipfs.io/ipfs/${message.file}`)}
                  {console.log("🔗 File URL ---:", message.file)}

                  {/* Xác định icon theo loại file */}
                  {message.file.endsWith(".doc") || message.file.endsWith(".docx") ? (
                    <AiOutlineFileWord className="text-blue-600 w-10 h-10 mr-2" />
                  ) : message.file.endsWith(".pdf") ? (
                    <AiOutlineFilePdf className="text-red-600 w-10 h-10 mr-2" />
                  ) : message.file.endsWith(".xlsx") ? (
                    <AiFillFileExcel className="text-green-700 w-10 h-10 mr-2" />
                  ) : (
                    <AiOutlineFile className="text-gray-600 w-10 h-10 mr-2" />
                  )}

                  {/* Tên file + Nút Download */}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold truncate max-w-[150px]">
                      {decodeURIComponent(message.file.split("/").pop())}
                    </span>
                    <button
                      onClick={() => downloadFile(message.file)}
                      className="text-blue-500 text-sm hover:underline"
                    >
                      ⬇ Tải về
                    </button>
                  </div>
                </div>
              )}




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
