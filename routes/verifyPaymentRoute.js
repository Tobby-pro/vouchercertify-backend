const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const prisma = require("../prisma/prismaClient");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.get("/verify-payment", async (req, res) => {
  const { reference, json } = req.query; // add ?json=1 to get JSON instead of redirect

  if (!reference) {
    return res.status(400).json({ status: "error", message: "Missing reference" });
  }

  try {
    // 1) Verify with Paystack
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      }
    );

    const pv = paystackRes.data?.data;
    if (!pv || pv.status !== "success") {
      return res.status(400).json({ status: "failed", message: "Payment not successful" });
    }

    // 2) Fetch matching order by reference
    const order = await prisma.order.findUnique({ where: { reference } });
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found for this reference" });
    }

    // 3) Amount sanity check (DB in Naira, Paystack in Kobo)
    const expectedKobo = Math.round(Number(order.amount) * 100);
    if (Number.isFinite(expectedKobo) && pv.amount !== expectedKobo) {
      console.warn(
        `Amount mismatch for ref ${reference}: Paystack=${pv.amount}kobo, DB=${expectedKobo}kobo`
      );
    }

    // 4) Idempotent status update + voucher code generation
    let updated = order;
    let justMarkedPaid = false;
    let justCreatedCode = false;

    if (order.status !== "PAID") {
      updated = await prisma.order.update({
        where: { reference },
        data: { status: "PAID" },
      });
      justMarkedPaid = true;
    }

    let voucherCode = updated.voucherCode;
    if (!voucherCode) {
      // secure random code: VC-XXXX-XXXX
      const partA = crypto.randomBytes(3).toString("hex").toUpperCase();
      const partB = crypto.randomBytes(3).toString("hex").toUpperCase();
      voucherCode = `VC-${partA.slice(0, 4)}-${partB.slice(0, 4)}`;

      updated = await prisma.order.update({
        where: { reference },
        data: { voucherCode },
      });
      justCreatedCode = true;
    }

    // 5) Send confirmation email only when first confirmed
    if (justMarkedPaid || justCreatedCode) {
      try {
        await sendEmail(
          updated.email,
          "Your Voucher Code",
          `
            <h1>Thank you for your payment!</h1>
            <p>Reference: <b>${reference}</b></p>
            <p>Voucher Code: <b>${updated.voucherCode}</b></p>
            <p>Amount Paid: ₦${(expectedKobo / 100).toFixed(2)}</p>
          `
        );
      } catch (e) {
        console.error("Email send failed:", e.message || e);
        // don't fail whole flow because email failed
      }
    }

    // 6) Redirect to success page (or JSON if requested)
    const successUrl = `${process.env.DOMAIN}/payment-success?reference=${encodeURIComponent(reference)}`;

    if (json) {
      return res.json({
        status: "success",
        message: "Payment verified",
        order: {
          email: updated.email,
          amount: expectedKobo,
          reference,
          voucherCode: updated.voucherCode,
        },
        next: successUrl,
      });
    }

    return res.redirect(successUrl);
  } catch (e) {
    console.error("Payment verification failed:", e.message || e);
    return res.status(500).json({ status: "error", message: "Payment verification failed" });
  }
});

module.exports = router;
