// routes/paystack-webhook.js

const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const prisma = require("../prisma/prismaClient"); // ✅ Your instantiated Prisma client

// Paystack Webhook Endpoint
router.post("/paystack-webhook", express.json({ type: "*/*" }), async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // ✅ Step 1: Verify Signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    console.warn("⚠️  Invalid Paystack signature");
    return res.status(401).send("Invalid signature");
  }

  // ✅ Step 2: Extract Payload
  const event = req.body;

  if (event.event === "charge.success") {
    const metadata = event.data.metadata;

    if (!metadata || !metadata.orderId) {
      console.warn("⚠️  Missing orderId in metadata");
      return res.status(400).send("Missing orderId");
    }

    const orderId = parseInt(metadata.orderId, 10);

    try {
      // ✅ Step 3: Update order to PAID
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });

      console.log(`✅ Order ID ${orderId} marked as PAID`);
    } catch (err) {
      console.error("❌ Error updating order status:", err);
      return res.status(500).send("Error updating order");
    }
  }

  // ✅ Step 4: Respond to Paystack
  res.sendStatus(200);
});

module.exports = router;
