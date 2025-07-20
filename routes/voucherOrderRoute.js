const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");

// POST /voucher-order
router.post("/", async (req, res) => {
  const { vendor, exam, currency, email, quantity } = req.body;

  if (!vendor || !exam || !currency || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty < 1) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  try {
    const voucher = await prisma.voucher.findUnique({
      where: { name: exam },
      include: { vendor: true },  // Include vendor info
    });

    if (!voucher) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Optional: check if vendor from req matches voucher.vendor.name
    if (voucher.vendor.name !== vendor) {
      return res.status(400).json({ error: "Vendor does not match the voucher" });
    }

    const totalAmount = voucher.price * qty;

    const order = await prisma.order.create({
      data: {
        email,
        voucher: { connect: { id: voucher.id } },
        amount: totalAmount,
        quantity: qty,
        status: "PENDING",
      },
    });

    console.log("💾 Order saved:", order);

    res.json({
      message: "Voucher order created successfully",
      data: {
        exam: voucher.name,
        vendor: voucher.vendor.name,
        price: voucher.price,
        quantity: qty,
        totalAmount,
        currency,
        email,
        description: voucher.description,
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("❌ Error handling /voucher-order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /voucher-price?exam=CCNA
router.get("/voucher-price", async (req, res) => {
  const { exam } = req.query;

  if (!exam) return res.status(400).json({ error: "Exam is required" });

  try {
    const voucher = await prisma.voucher.findUnique({
      where: { name: exam },
      include: { vendor: true }, // optional, if you want vendor info
    });

    if (!voucher) return res.status(404).json({ error: "Exam not found" });

    res.json({ 
      price: voucher.price,
      vendor: voucher.vendor.name,  // optional
    });
  } catch (error) {
    console.error("❌ Error in /voucher-price:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
