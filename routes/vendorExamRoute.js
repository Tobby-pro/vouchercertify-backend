const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");

// GET /vendors-with-exams
router.get("/", async (req, res) => {
  try {
    // Fetch vouchers with vendor relation included
    const vouchers = await prisma.voucher.findMany({
      include: { vendor: true },
    });

    // Group exams by vendor name
    const grouped = vouchers.reduce((acc, voucher) => {
      const vendorName = voucher.vendor.name;
      if (!acc[vendorName]) {
        acc[vendorName] = [];
      }
      acc[vendorName].push(voucher.name);
      return acc;
    }, {});

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching vendor exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
