import React, { useEffect } from "react";
import { useCloudStore } from "../store/useCloundStore";
import { FaCloud, FaCrown, FaStar } from "react-icons/fa";

const CloudPage = () => {
  const { cloudStorage, isLoading, purchasePackage, getMyCloud } = useCloudStore();

  useEffect(() => {
    getMyCloud();
  }, []);

  const API_BASE =
    typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE
      ? import.meta.env.VITE_API_BASE
      : "http://localhost:5000";

  const cloudPackages = [
    {
      id: "basic",
      name: "Basic Cloud",
      capacity: "1 GB",
      capacityMB: 1024,
      price: "10.000đ",
      amount: 10000,
      icon: <FaCloud className="text-blue-400 text-4xl" />,
    },
    {
      id: "plus",
      name: "Plus Cloud",
      capacity: "5 GB",
      capacityMB: 5 * 1024,
      price: "30.000đ",
      amount: 30000,
      icon: <FaStar className="text-yellow-400 text-4xl" />,
    },
    {
      id: "premium",
      name: "Premium Cloud",
      capacity: "20 GB",
      capacityMB: 20 * 1024,
      price: "99.000đ",
      amount: 99000,
      icon: <FaCrown className="text-orange-400 text-4xl" />,
    },
  ];

  const payWithZalo = async (pkg) => {
    try {
      const resp = await fetch(`${API_BASE}/api/zalopay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "",
          amount: pkg.amount,
          capacityMB: pkg.capacityMB,
          days: 30,
        }),
      });
      const data = await resp.json();

      if (data && data.order_url) {
        window.open(data.order_url, "zalopay_checkout", "width=500,height=700");
      } else if (data && data.order_token) {
        const checkoutUrl = `https://sb.zalopay.vn/checkout?order_token=${data.order_token}`;
        window.open(checkoutUrl, "zalopay_checkout", "width=500,height=700");
      } else {
        console.error("Unexpected ZaloPay response:", data);
        alert("Payment initialization failed. Check console.");
      }
    } catch (err) {
      console.error("payWithZalo err:", err);
      alert("Cannot reach backend or ZaloPay. Start backend and check network / CORS.");
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 pt-20 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cloud Storage Packages</h1>

      {/* Thông tin cloud của user */}
      <div className="bg-white shadow-md p-5 rounded-lg border mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Cloud Storage</h2>
        {!cloudStorage ? (
          <p className="text-gray-500">Bạn chưa mua gói Cloud nào. Hãy chọn 1 gói bên dưới.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Trạng thái:</strong>{" "}
              {cloudStorage.isActive ? (
                <span className="text-green-600 font-semibold">Đang kích hoạt</span>
              ) : (
                <span className="text-red-600 font-semibold">Chưa kích hoạt</span>
              )}
            </p>
            <p>
              <strong>Dung lượng:</strong>{" "}
              <span className="text-blue-600 font-semibold">{cloudStorage.capacity} MB</span>
            </p>
            <p>
              <strong>Ngày kích hoạt:</strong>{" "}
              {cloudStorage.purchasedAt
                ? new Date(cloudStorage.purchasedAt).toLocaleDateString()
                : "—"}
            </p>
            <p>
              <strong>Ngày hết hạn:</strong>{" "}
              {cloudStorage.expiresAt ? new Date(cloudStorage.expiresAt).toLocaleDateString() : "—"}
            </p>
          </div>
        )}
      </div>

      {/* Danh sách gói Cloud */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cloudPackages.map((pkg) => {
          const isPurchased = cloudStorage?.packageId === pkg.id;
          return (
            <div
              key={pkg.id}
              className={`bg-white border rounded-xl shadow-md p-6 text-center transition relative
              ${isPurchased ? "ring-2 ring-green-500" : ""}`}
            >
              {/* Badge “Đã mua” */}
              {isPurchased && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  Đã mua
                </span>
              )}

              <div className="mb-3 flex justify-center">{pkg.icon}</div>

              <h3 className="text-lg font-bold text-gray-800">{pkg.name}</h3>

              <p className="text-gray-600 mt-1">
                Dung lượng: <span className="font-semibold">{pkg.capacity}</span>
              </p>

              <p className="text-gray-800 text-xl font-bold mt-2">{pkg.price}</p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => purchasePackage(pkg.id)}
                  disabled={isLoading || isPurchased}
                  className={`w-full py-2 rounded-md transition
                    ${isPurchased
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                >
                  {isPurchased ? "Đã sở hữu" : isLoading ? "Đang xử lý..." : "Mua ngay"}
                </button>

                <button
                  onClick={() => payWithZalo(pkg)}
                  disabled={isLoading || isPurchased}
                  className={`w-full py-2 rounded-md transition
                    ${isPurchased
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"}`}
                >
                  Thanh toán bằng ZaloPay
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CloudPage;
