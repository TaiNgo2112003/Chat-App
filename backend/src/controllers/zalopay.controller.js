import crypto from "crypto";
import fetch from "node-fetch";

// Create ZaloPay order (basic implementation - sandbox)
export async function createOrder(req, res) {
  try {
    const { userId, amount, capacityMB = 0, days = 30 } = req.body;
    if (!userId || !amount) return res.status(400).json({ error: "Missing userId or amount" });

    const ZALO_APP_ID = process.env.appId; // from your .env
    const ZALO_KEY1 = process.env.macKey; // key1 used for create-order mac
    const ZALO_CREATE_URL = process.env.ZALOPAY_CREATE_ORDER_URL || "https://sb-openapi.zalopay.vn/v2/create";

    const appuser = userId.toString();
    const apptime = Date.now();
    const apptransid = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const embeddata = JSON.stringify({ userId, capacityMB, days });
    const item = JSON.stringify([{ name: "Cloud Storage", amount, qty: 1 }]);

    // mac = HMAC_SHA256(key1, "appid|apptransid|appuser|amount|apptime|embeddata|item")
    const raw = `${ZALO_APP_ID}|${apptransid}|${appuser}|${amount}|${apptime}|${embeddata}|${item}`;
    const mac = crypto.createHmac("sha256", ZALO_KEY1 || "").update(raw).digest("hex");

    const body = {
      app_id: Number(ZALO_APP_ID),
      app_trans_id: apptransid,
      app_user: appuser,
      amount: Number(amount),
      app_time: apptime,
      embed_data: embeddata,
      item: item,
      mac,
    };

    const resp = await fetch(ZALO_CREATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const j = await resp.json();
    // return ZaloPay response to frontend (contains order_url or order_token depending on account)
    return res.json(j);
  } catch (err) {
    console.error("createOrder err:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}
