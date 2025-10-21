const express = require('express');
const router = express.Router();
const prisma = require('./prisma/prismaClient');
const { sendVoucherEmail } = require('./emailService');

router.post('/', async (req, res) => {
  try {
    const { email, vendor, exam, currency } = req.body;

    // Basic validation
    if (!email || !vendor || !exam || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Lookup voucher based on vendor + exam (voucher.name = exam)
    const voucher = await prisma.voucher.findFirst({
      where: {
        vendor,
        name: exam
      }
    });

    if (!voucher) {
      return res.status(404).json({ error: 'Voucher not found for selected exam/vendor' });
    }

    const quantity = 1;
    const amount = voucher.price * quantity;

    // Create the order
    const order = await prisma.order.create({
      data: {
        email,
        voucherId: voucher.id,
        amount,
        quantity,
        currency,
        status: 'PAID' // You can simulate payment here
      }
    });

    // Send confirmation email
    await sendVoucherEmail(email, order.orderNumber);

    return res.status(201).json({
      message: 'Order successful! Voucher sent via email.',
      order
    });

  } catch (error) {
    console.error('Checkout error:', error.message);
    return res.status(500).json({ error: 'Checkout failed. Please try again.' });
  }
});

module.exports = router;
