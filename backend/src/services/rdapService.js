const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load RDAP server mappings
const rdapDataIana = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/rdap-servers-iana.json'), 'utf8')
);
const rdapServersExtra = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/rdap-servers-extra.json'), 'utf8')
);

// Build RDAP server lookup map from IANA data
const rdapServerMap = {};
if (rdapDataIana.services && Array.isArray(rdapDataIana.services)) {
  rdapDataIana.services.forEach(service => {
    if (service[0] && service[1]) {
      service[0].forEach(tld => {
        rdapServerMap[tld] = service[1][0];
      });
    }
  });
}

// Merge with extra servers
Object.assign(rdapServerMap, rdapServersExtra);

/**
 * Get RDAP server URL for a given TLD
 * @param {string} tld - Top-level domain
 * @returns {string|null} RDAP server URL or null
 */
function getRdapServer(tld) {
  return rdapServerMap[tld] || null;
}

/**
 * Query RDAP information for a domain
 * @param {string} domain - Domain name to query
 * @param {string} tld - Top-level domain
 * @returns {Promise<Object>} RDAP response data
 */
async function queryRdap(domain, tld) {
  const serverUrl = getRdapServer(tld);

  if (!serverUrl) {
    throw new Error(`No RDAP server found for TLD: .${tld}`);
  }

  try {
    const url = `${serverUrl}domain/${domain}`;
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/rdap+json, application/json'
      },
      validateStatus: (status) => status < 500 // Accept 4xx as valid responses
    });

    // Check content type
    const contentType = response.headers['content-type'] || '';
    if (!contentType.match(/^(application\/(rdap\+)?json)/i)) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    // Check for HTTP errors
    if (response.status >= 400) {
      throw new Error(`RDAP server returned status ${response.status}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`RDAP query failed: ${error.response.status} ${error.response.statusText}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('RDAP query timed out');
    } else {
      throw error;
    }
  }
}

module.exports = {
  queryRdap,
  getRdapServer
};
