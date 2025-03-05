import { useState } from "react";
import { axiosInstance } from "../lib/axios";
export default function AIImage() {
  const [imageUrl, setImageUrl] = useState("");
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState("remove_background");

  const actionLabels = {
    remove_background: "Xóa nền",
    create_image: "Tạo ảnh",
    create_video: "Tạo video",
  };
  const handleAction = async () => {
    if (!imageUrl) return;
    setLoading(true);
    try {
      switch (selectedAction) {
        case "remove_background":
          await removerBackground();
          break;
        case "create_image":
          await createImage();
          break;
        case "create_video":
          alert("Chức năng tạo video chưa khả dụng!");
          break;
        default:
          alert("Vui lòng chọn một hành động hợp lệ!");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý:", error);
    }
    setLoading(false);

  }
  const removerBackground = async () => {
    if (!imageUrl) return;

    setLoading(true);
    try {
      if (selectedAction === "remove_background") {
        const response = await axiosInstance.post(
          "/ai/remove-background",  // ✅ Chỉ cần đường dẫn tương đối
          { image_url: imageUrl },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        setProcessedImage(response.data.result_url);
      } else {
        alert("Chức năng này hiện chưa khả dụng!");
      }
    } catch (error) {
      console.error("Lỗi xử lý:", error.response?.data || error.message);
    }
    setLoading(false);
  };

  const createImage = async () => {
    if (!imageUrl) return;

    setLoading(true);
    try {
      if (selectedAction === "create_image") {
        const response = await axiosInstance.post(
          "/ai/create-image",  // ✅ Đường dẫn tương đối
          { text: imageUrl, resolution: "1024x1024" },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          }
        );
        const generatedImageUrl = response.data.openai.items[0].image_resource_url;
        setProcessedImage(generatedImageUrl);
      } else {
        alert("Chức năng này hiện chưa khả dụng!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo ảnh:", error.response?.data || error.message);
    }
    setLoading(false);
  };



  return (
    <div className="flex flex-col items-center p-8 space-y-6 h-screen bg-base-200 min-h-screen">
      <br />
      <div className="w-full max-w-2xl bg-base-100 p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Công Cụ AI</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nhập mô tả hoặc URL ảnh..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="remove_background">Xóa nền ảnh</option>
            <option value="create_image">Tạo ảnh từ văn bản</option>
            <option value="create_video">Tạo video từ ảnh</option>
          </select>

          <button
            onClick={handleAction}
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {loading ? "Đang xử lý..." : "Thực hiện"}
          </button>

        </div>

        {processedImage && (
          <div className="mt-5 border-t-black pt-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Kết quả xử lý
            </h2>
            <div className="flex justify-center border p-2 rounded-lg">
              <img
                src={processedImage}
                alt="Kết quả xử lý"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

}