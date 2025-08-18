const express = require("express");
const axios = require("axios");
const prisma = require("../prisma/prismaClient");
const router = express.Router();

router.get("/paystack-initiate", async (req, res) => {
  const { orderId } = req.query;

  if (!orderId) {
    console.warn(`[WARN ${new Date().toISOString()}] Missing orderId in request`);
    return res.status(400).json({ error: "Missing orderId" });
  }

  try {
    // 1️⃣ Fetch order from DB
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId, 10) },
      include: { voucher: true } // optional extra info
    });

    console.log(`[DEBUG ${new Date().toISOString()}] Order fetched:`, order ? "✅ FOUND" : "❌ NOT FOUND");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 2️⃣ Check env variables
    console.log(`[DEBUG ${new Date().toISOString()}] DOMAIN:`, process.env.DOMAIN || "❌ NOT SET");
    console.log(`[DEBUG ${new Date().toISOString()}] PAYSTACK_SECRET_KEY set?`, !!process.env.PAYSTACK_SECRET_KEY);

    // 3️⃣ Check required order fields
    if (!order.email) {
      console.error(`[ERROR ${new Date().toISOString()}] Order email is missing`);
      return res.status(400).json({ error: "Order email is missing" });
    }
    if (!order.amount) {
      console.error(`[ERROR ${new Date().toISOString()}] Order amount is missing`);
      return res.status(400).json({ error: "Order amount is missing" });
    }

    // 4️⃣ Call Paystack API
    console.log(`[DEBUG ${new Date().toISOString()}] Sending to Paystack:`, {
      email: order.email,
      amount: Math.round(order.amount * 100),
      callback_url: `${process.env.DOMAIN}/payment-success`
    });

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: order.email,
        amount: Math.round(order.amount * 100),
        currency: "NGN",
        metadata: { orderId: order.id },
        callback_url: `${process.env.DOMAIN}/payment-success`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const redirectUrl = paystackRes.data.data.authorization_url;
    console.log(`[DEBUG ${new Date().toISOString()}] Paystack redirect URL:`, redirectUrl);

    // 5️⃣ Redirect to Paystack
    res.redirect(redirectUrl);

  } catch (err) {
    // 6️⃣ Log Paystack or server errors
    if (err.response) {
      console.error(`[ERROR ${new Date().toISOString()}] Paystack API Error:`, err.response.data);
      return res.status(500).json({
        error: "Paystack API error",
        details: err.response.data,
      });
    } else {
      console.error(`[ERROR ${new Date().toISOString()}] Server error:`, err.message);
      return res.status(500).json({
        error: "Internal server error",
        details: err.message,
      });
    }
  }
});

module.exports = router;
