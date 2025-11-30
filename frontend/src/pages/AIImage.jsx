import { useState } from "react";
import { axiosInstance } from "../lib/axios";

export default function AIImage() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!imageUrl && !imageFile) {
      alert("Vui lòng nhập URL hoặc chọn file ảnh!");
      return;
    }

    setLoading(true);
    setProcessedImage(null);

    try {
      let response;

      if (imageFile) {
        // gửi ảnh bằng multipart/form-data
        const formData = new FormData();
        formData.append("file", imageFile);

        response = await axiosInstance.post("/ai/remove-background", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (imageUrl) {
        // gửi URL bằng JSON
        response = await axiosInstance.post(
          "/ai/remove-background",
          { image_url: imageUrl }
        );
      }

      setProcessedImage(response.data.result_url);
    } catch (error) {
      console.error("Lỗi xử lý:", error.response?.data || error.message);
      alert("Xử lý ảnh thất bại, xem console để debug!");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-8 space-y-6 min-h-screen bg-base-200">
      <div className="w-full max-w-2xl bg-base-100 p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Công Cụ AI Xóa Nền</h1>

        {/* Input URL */}
        <input
          type="text"
          placeholder="Nhập URL ảnh..."
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            imageFile ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={!!imageFile}
        />

        <div className="text-center text-sm text-gray-500">Hoặc chọn file ảnh</div>

        {/* Input file */}
        <input
          type="file"
          accept="image/*"
          className={`w-full p-2 border rounded-lg ${
            imageUrl ? "bg-gray-200 cursor-not-allowed" : ""
          }`}
          onChange={(e) => setImageFile(e.target.files[0])}
          disabled={!!imageUrl}
        />

        {/* Button */}
        <button
          onClick={handleAction}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Đang xử lý..." : "Xóa nền"}
        </button>

        {/* Result */}
        {processedImage && (
          <div className="mt-5">
            <h2 className="text-xl font-semibold text-center mb-2">Kết quả</h2>
            <div className="flex justify-center border p-2 rounded-lg">
              <img src={processedImage} alt="Result" className="max-w-full h-auto rounded-lg" />
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
