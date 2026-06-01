const express = require('express');
const router = express.Router();
const { queryWhois } = require('../services/whoisService');
const { parseWhoisData } = require('../parsers/genericParser');

/**
 * GET /api/whois?domain=example.com
 * Query WHOIS information for a domain
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

    // Query WHOIS
    const rawWhois = await queryWhois(domain, tld);

    // Parse WHOIS data
    const parsedData = parseWhoisData(rawWhois, domain);

    if (!parsedData) {
      return res.json({
        code: 0,
        msg: 'No WHOIS data available',
        data: {
          domain: domain,
          raw: rawWhois,
          available: true
        }
      });
    }

    res.json({
      code: 0,
      msg: 'Query successful',
      data: parsedData
    });
  } catch (error) {
    console.error('WHOIS query error:', error.message);
    res.status(500).json({
      code: 1,
      msg: error.message,
      data: null
    });
  }
});

module.exports = router;
