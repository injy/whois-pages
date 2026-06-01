const net = require('net');
const fs = require('fs');
const path = require('path');

// Load WHOIS server mappings
const whoisServersIana = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/whois-servers-iana.json'), 'utf8')
);
const whoisServersExtra = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/whois-servers-extra.json'), 'utf8')
);

// Merge server mappings
const whoisServers = { ...whoisServersIana, ...whoisServersExtra };

/**
 * Get WHOIS server for a given TLD
 * @param {string} tld - Top-level domain
 * @returns {string|null} WHOIS server hostname or null
 */
function getWhoisServer(tld) {
  return whoisServers[tld] || null;
}

/**
 * Query WHOIS information for a domain
 * @param {string} domain - Domain name to query
 * @param {string} tld - Top-level domain
 * @returns {Promise<string>} Raw WHOIS data
 */
function queryWhois(domain, tld) {
  return new Promise((resolve, reject) => {
    const server = getWhoisServer(tld);

    if (!server) {
      reject(new Error(`No WHOIS server found for TLD: .${tld}`));
      return;
    }

    // Special handling for certain TLDs
    let query = `${domain}\r\n`;

    // German .de domains require special format
    if (tld === 'de') {
      query = `-T dn,ace ${domain}\r\n`;
    }

    const socket = net.createConnection(43, server);

    let data = '';
    let timeoutId;

    socket.on('connect', () => {
      socket.write(query);
    });

    socket.on('data', (chunk) => {
      data += chunk.toString();
    });

    socket.on('end', () => {
      clearTimeout(timeoutId);
      resolve(data);
    });

    socket.on('error', (err) => {
      clearTimeout(timeoutId);
      reject(err);
    });

    // Set timeout
    timeoutId = setTimeout(() => {
      socket.destroy();
      reject(new Error('WHOIS query timed out'));
    }, 10000);
  });
}

module.exports = {
  queryWhois,
  getWhoisServer
};
