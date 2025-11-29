import crypto from "crypto";
import axios from "axios";
import User from "../models/user.model.js";

const ZALOPAY_APP_ID = process.env.appId;
const ZALOPAY_KEY1 = process.env.macKey;

const CREATE_ORDER_URL = "https://sb-openapi.zalopay.vn/v2/create";

const CLOUD_PACKAGES = {
    basic:   { capacity: 1024,  price: 10000 },
    plus:    { capacity: 5120,  price: 30000 },
    premium: { capacity: 20480, price: 99000 },
};


function generateMac({ app_id, app_trans_id, app_user, amount, app_time, embed_data, item }) {
    const raw = `${app_id}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embed_data}|${item}`;
    return crypto.createHmac("sha256", ZALOPAY_KEY1 || "").update(raw).digest("hex");
}
export const getMyCloud = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(req.user._id).select("cloudStorage");
    console.log("getMyCloud - user cloudStorage:", user.cloudStorage);
    return res.status(200).json({
      cloudStorage: user.cloudStorage,
    });

  } catch (error) {
    console.error("getMyCloud error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const purchaseCloudPackage = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ error: "Bạn cần đăng nhập" });

        const { packageId } = req.body;
        const pkg = CLOUD_PACKAGES[packageId];

        if (!pkg) return res.status(400).json({ error: "Gói cloud không hợp lệ" });

        const yymmdd = new Date().toISOString().slice(2,10).replace(/-/g, "");
        const app_trans_id = `${yymmdd}_${Date.now()}`;

        const app_time = Date.now();
        const embed_data = JSON.stringify({ packageId, capacity: pkg.capacity, userId: userId.toString() });
        const item = JSON.stringify([{ name: `Cloud ${packageId}`, amount: pkg.price, qty: 1 }]);

        const order = {
            app_id: Number(ZALOPAY_APP_ID),
            app_trans_id,
            app_user: userId.toString(),
            amount: pkg.price,
            app_time,
            embed_data,
            item,
            description: `Thanh toán gói Cloud: ${packageId}`,
            callback_url: "https://chat-app-y8dr.onrender.com", 
            bank_code: "",
        };

        order.mac = generateMac(order);

        const zaloResponse = await axios.post(CREATE_ORDER_URL, order, {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        });

        console.log("ZaloPay create order response:", zaloResponse.data);


        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                cloudStorage: {
                    isActive: true,
                    capacity: pkg.capacity,
                    purchasedAt: new Date(),
                    packageId: packageId,
                    expiresAt,
                    transactionId: app_trans_id,
                },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Gói cloud đã được kích hoạt",
            zaloOrder: zaloResponse.data,
            cloudStorage: updatedUser.cloudStorage,
        });

    } catch (error) {
        console.error("❌ purchaseCloudPackage error:", error.response?.data || error.message || error);
        const errData = error.response?.data;
        const msg = errData ? (errData.return_message || errData.error || JSON.stringify(errData)) : "Lỗi server";
        return res.status(500).json({ error: msg });
    }
};
