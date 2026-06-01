/**
 * Client-side RDAP service
 * Queries RDAP directly from the browser using public RDAP servers
 */

// Load RDAP server mappings (will be loaded dynamically)
let rdapServerMap = null;

/**
 * Initialize RDAP server map by loading JSON files
 */
async function initRdapServers() {
  if (rdapServerMap) return rdapServerMap;

  try {
    // Load IANA RDAP servers
    const ianaResponse = await fetch('/rdap-servers-iana.json');
    const ianaData = await ianaResponse.json();

    // Build server map from IANA data
    rdapServerMap = {};
    if (ianaData.services && Array.isArray(ianaData.services)) {
      ianaData.services.forEach(service => {
        if (service[0] && service[1]) {
          service[0].forEach(tld => {
            rdapServerMap[tld] = service[1][0];
          });
        }
      });
    }

    // Load and merge extra servers
    try {
      const extraResponse = await fetch('/rdap-servers-extra.json');
      const extraData = await extraResponse.json();
      Object.assign(rdapServerMap, extraData);
    } catch (err) {
      console.warn('Failed to load extra RDAP servers:', err);
    }

    return rdapServerMap;
  } catch (error) {
    console.error('Failed to initialize RDAP servers:', error);
    return {};
  }
}

/**
 * Get RDAP server URL for a given TLD
 * @param {string} tld - Top-level domain
 * @returns {string|null} RDAP server URL or null
 */
async function getRdapServer(tld) {
  const servers = await initRdapServers();
  return servers[tld] || null;
}

/**
 * Query RDAP information for a domain directly from browser
 * @param {string} domain - Domain name to query
 * @param {string} tld - Top-level domain
 * @returns {Promise<Object>} RDAP response data
 */
export async function queryRdap(domain, tld) {
  const serverUrl = await getRdapServer(tld);

  if (!serverUrl) {
    throw new Error(`No RDAP server found for TLD: .${tld}`);
  }

  try {
    const url = `${serverUrl}domain/${domain}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/rdap+json, application/json'
      }
    });

    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`RDAP server returned status ${response.status}`);
      }
      throw new Error(`RDAP query failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.match(/^(application\/(rdap\+)?json)/i)) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('RDAP query failed: Network error or CORS restriction');
    }
    throw error;
  }
}
