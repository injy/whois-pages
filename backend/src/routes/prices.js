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
    // Extract TLD
    const parts = domain.split('.');
    const tld = parts[parts.length - 1];

    // Get prices
    const prices = getPrices(tld);

    // Simulate network delay for realistic UX (minimum 500ms)
    setTimeout(() => {
      res.json({
        code: 0,
        msg: 'Query successful',
        data: prices
      });
    }, 500);
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
