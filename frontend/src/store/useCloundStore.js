import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useCloudStore = create((set, get) => ({
  cloudStorage: null,
  isLoading: false,

  // 🟩 Lấy cloud storage của user
  getMyCloud: async () => {
    try {
      set({ isLoading: true });

      // correct route: backend mounts cloud routes under /api/cloud
      const res = await axiosInstance.get("/cloud/me/cloud");
      set({ cloudStorage: res.data.cloudStorage });

    } catch (error) {
      console.error("Lỗi khi lấy thông tin cloud:", error);
      toast.error("Không thể tải dữ liệu cloud.");
    } finally {
      set({ isLoading: false });
    }
  },

  // 🟦 Mua gói cloud — gọi API + mở popup thanh toán
  purchasePackage: async (packageId) => {
  let popup = null;
  try {
    set({ isLoading: true });

    popup = window.open("", "zalopay_checkout", "width=500,height=700");
    if (!popup) {
      toast.error("Popup bị chặn. Vui lòng cho phép popup.");
      set({ isLoading: false });
      return;
    }
    try { popup.document.body.innerHTML = "<p>Đang khởi tạo thanh toán...</p>"; } catch {}

    const res = await axiosInstance.post("/cloud/purchase", { packageId });

    // ⬇️ UPDATE STORE NGAY LẬP TỨC
    set({ cloudStorage: res.data.cloudStorage });

    const zaloOrder = res.data.zaloOrder;

    if (zaloOrder.order_url) {
      popup.location.href = zaloOrder.order_url;
      return;
    }

    const token = zaloOrder.order_token || zaloOrder.zp_trans_token || zaloOrder.token;
    if (token) {
      popup.location.href = `https://sb.zalopay.vn/checkout?order_token=${token}`;
      return;
    }

    popup.close();
    toast.error("Không thể mở thanh toán.");
  } catch (error) {
    try { popup?.close(); } catch {}
    toast.error(error.response?.data?.error || "Lỗi mua Cloud.");
  } finally {
    set({ isLoading: false });
  }
},

}));
