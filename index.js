// index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma/prismaClient');
const checkoutRoute = require('./checkoutRoute');
const vendorsRoute = require('./vendorsRoute');
const vendorExamRoute = require("./routes/vendorExamRoute");
const voucherOrderRoute = require('./routes/voucherOrderRoute');
const paystackWebhookRoute = require("./routes/paystack-webhook");
const paystackInitiateRoute = require('./routes/paystack-initiate');
const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('VoucherCertify API is running 🚀');
});


// Routes
app.use('/checkout', checkoutRoute);
app.use('/', vendorsRoute);
app.use("/vendors-with-exams", vendorExamRoute);
app.use("/voucher-order", voucherOrderRoute);
app.use("/", paystackWebhookRoute);
app.use("/", paystackInitiateRoute);

// GET all vouchers
app.get('/vouchers', async (req, res) => {
  try {
    const vouchers = await prisma.voucher.findMany();
    res.json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ error: 'Failed to fetch vouchers' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
