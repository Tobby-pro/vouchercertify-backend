const express = require("express");
const crypto = require("crypto");
const prisma = require("../prisma/prismaClient");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// ✅ Use the Paystack secret key from .env
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

router.post("/paystack-webhook", express.json({ type: "/" }), async (req, res) => {
try {
// Step 1: Verify Paystack signature
const hash = crypto
.createHmac("sha512", PAYSTACK_SECRET_KEY)
.update(JSON.stringify(req.body))
.digest("hex");
if (hash !== req.headers["x-paystack-signature"]) {  
  console.warn("❌ Invalid Paystack signature");  
  return res.status(400).send("Invalid signature");  
}  

const event = req.body;  

// Step 2: Only process successful charges  
if (event.event === "charge.success") {  
  const metadata = event.data.metadata;  

  if (!metadata || !metadata.orderId) {  
    console.warn("⚠️ Missing orderId in metadata");  
    return res.status(400).send("Missing orderId");  
  }  

  const orderId = parseInt(metadata.orderId, 10);  

  // Step 3: Update order to PAID & fetch related data  
  const updatedOrder = await prisma.order.update({  
    where: { id: orderId },  
    data: { status: "PAID" },  
    include: {  
      user: true,  
      voucher: true,  
    },  
  });  

  console.log(`✅ Order ID ${orderId} marked as PAID`);  

  // Step 4: Decide which email to send to  
  const recipientEmail = updatedOrder.user?.email || updatedOrder.email;  

  // Step 5: Send voucher email dynamically using sendEmail  
  await sendEmail(recipientEmail, "Your Voucher Code", `  
    <h1>Thank you for your payment!</h1>  
    <p>Your voucher for <b>${updatedOrder.voucher.name}</b> has been successfully purchased.</p>  
    <p>Order Number: <b>${updatedOrder.orderNumber}</b></p>  
    <p>Status: <b>${updatedOrder.status}</b></p>  
    <p>Visit <a href="${process.env.DOMAIN}">our website</a> to use your voucher.</p>  
  `);  

  console.log(`📩 Voucher email sent to ${recipientEmail}`);  
}  

res.sendStatus(200);
} catch (err) {
console.error("❌ Error processing Paystack webhook:", err);
res.status(500).send("Webhook error");
}
});

module.exports = router; 

