const express = require('express');
const router = express.Router();
const { getPrices } = require('../services/priceService');

/**
 * GET /api/prices?domain=example.com
 * Get pricing information for a domain TLD
 */
router.get('/', (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({
      code: 1,
      msg: 'Domain parameter is required',
      data: null
    });
  }

  try {
    const parts = domain.split('.');
    const tld = parts[parts.length - 1];

    const prices = getPrices(tld);

    res.json({
      code: 0,
      msg: 'Query successful',
      data: prices
    });
  } catch (error) {
    console.error('Price query error:', error.message);
    res.status(500).json({
      code: 1,
      msg: error.message,
      data: null
    });
  }
});

module.exports = router;
