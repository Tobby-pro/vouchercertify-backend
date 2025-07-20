// routes/paystack-initiate.js

const express = require("express");
const axios = require("axios");
const prisma = require("../prisma/prismaClient");
const router = express.Router();

router.get("/paystack-initiate", async (req, res) => {
  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId" });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId, 10) },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: order.email,
        amount: order.totalAmount * 100, // Convert to kobo
        currency: order.currency,
        metadata: {
          orderId: order.id,
        },
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
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Paystack error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

module.exports = router;
