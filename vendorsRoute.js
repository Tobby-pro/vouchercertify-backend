const express = require('express');
const router = express.Router();
const prisma = require('./prisma/prismaClient');

// Add mapping from vendor name to logo filename (with extension)
const vendorLogos = {
  'Cisco': 'cisco.svg',
  'EC-Council': 'ec-council.png',
  'PMI': 'pmi.jpg',
  'ISC': 'isc.svg',
  'Microsoft': 'microsoft.svg',
  'Axelos': 'axelos.ico',
  'AWS': 'aws.svg',
  'CompTIA': 'comptia.svg',
  'Google': 'google.svg',
  'Oracle': 'oracle.jpg',
  // Add all vendors here exactly as they are in your public/vendors folder
};

router.get('/vendors', async (req, res) => {
  try {
    const vendors = await prisma.voucher.findMany({
      distinct: ['vendorId'],
      include: {
        vendor: {
          select: { name: true }
        }
      }
    });

    const result = vendors.map(v => {
      const vendorName = v.vendor.name;
      const mappedIcon = vendorLogos[vendorName];
      console.log(`Vendor from DB: "${vendorName}" => icon: ${mappedIcon || 'default.svg'}`);
      return {
        vendor: vendorName,
        icon: mappedIcon || 'default.svg'
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Failed to fetch vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors', details: error.message });
  }
});

router.get('/vendors-with-vouchers', async (req, res) => {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: { vendor: true },
    });

    const grouped = {};

    for (const voucher of vouchers) {
      const vendorName = voucher.vendor.name;

      if (!grouped[vendorName]) {
        grouped[vendorName] = {
          vendor: vendorName,
          icon: vendorLogos[vendorName] || 'default.svg',
          vouchers: [],
        };
      }

      grouped[vendorName].vouchers.push({
        id: voucher.id,
        name: voucher.name,
        price: voucher.price,
        description: voucher.description,
      });
    }

    res.json(Object.values(grouped));
  } catch (error) {
    console.error('Error fetching vendors with vouchers:', error);
    res.status(500).json({ error: 'Failed to fetch grouped vouchers' });
  }
});


module.exports = router;
