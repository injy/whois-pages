const express = require('express');
const router = express.Router();
const { queryRdap } = require('../services/rdapService');

/**
 * GET /api/rdap?domain=example.com
 * Query RDAP information for a domain
 */
router.get('/', async (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({
      code: 1,
      msg: 'Domain parameter is required',
      data: null
    });
  }

  // Validate domain format
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    return res.status(400).json({
      code: 1,
      msg: 'Invalid domain format',
      data: null
    });
  }

  try {
    // Extract TLD
    const parts = domain.split('.');
    const tld = parts[parts.length - 1];

    // Query RDAP
    const rdapData = await queryRdap(domain, tld);

    res.json({
      code: 0,
      msg: 'Query successful',
      data: rdapData
    });
  } catch (error) {
    console.error('RDAP query error:', error.message);

    // Return appropriate error based on the type
    if (error.message.includes('No RDAP server found')) {
      return res.json({
        code: 0,
        msg: 'RDAP not supported for this TLD',
        data: null,
        notSupported: true
      });
    }

    res.status(500).json({
      code: 1,
      msg: error.message,
      data: null
    });
  }
});

module.exports = router;
