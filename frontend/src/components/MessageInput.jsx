import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile, MapPin, FileText, File } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle remove image preview
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle File Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFilePreview(file); 
  };

  // Handle remove file preview
  const removeFile = () => {
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle send message with image and file
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !filePreview) return;

    try {
        // Tạo FormData object
        const formData = new FormData();
        formData.append("text", text.trim()); // Thêm text vào formData

        if (imagePreview) {
            // Nếu có ảnh, thêm ảnh vào formData
            formData.append("image", imagePreview);
        }

        if (filePreview) {
            // Nếu có file, thêm file vào formData
            formData.append("file", filePreview);
        }

        // Gửi dữ liệu đến backend
        await sendMessage(formData);

        console.log("filePreview", filePreview);

        // Clear form
        setText("");
        setImagePreview(null);
        setFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
        console.error("Failed to send message:", error);
    }
};

  // Handle send emoji
  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  // Handle send location
  const sendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setText(`Location: https://maps.google.com/?q=${latitude},${longitude}`);
        },
        () => toast.error("Failed to retrieve location")
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* File Preview */}
      {filePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <FileText size={20} className="text-gray-600" />
            <span className="ml-2">{filePreview.name || "File"}</span>
            <button
              onClick={removeFile}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files[0].type.startsWith("image/")) {
                handleImageChange(e); // Call handleImageChange for image
              } else {
                handleFileChange(e); // Call handleFileChange for other files
              }
            }}
          />

          {/* Emoji Picker Button */}
          <button
            type="button"
            className="btn btn-circle"
            title="Send Emoji & Icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={20} />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 bg-white shadow-lg rounded-lg p-2 z-50">
              <EmojiPicker
                onEmojiClick={addEmoji}
                searchDisabled={false}
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}

          {/* GPS Button */}
          <button
            type="button"
            title="Send Location"
            className="btn btn-circle"
            onClick={sendLocation}
          >
            <MapPin size={20} />
          </button>

          {/* Image Upload Button */}
          <button
            type="button"
            className="btn btn-circle"
            title="Upload Image"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          {/* File Upload Button */}
          <button
            type="button"
            className="btn btn-circle"
            title="Attach File"
            onClick={() => fileInputRef.current?.click()}
          >
            <File size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          title="Submit Your Content"
          disabled={!text.trim() && !imagePreview && !filePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
