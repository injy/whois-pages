/**
 * Generic WHOIS data parser
 * Extracts common fields from raw WHOIS text using regex patterns
 */

/**
 * Parse raw WHOIS text into structured data
 * @param {string} whoisText - Raw WHOIS response
 * @param {string} domain - Domain name
 * @returns {Object} Parsed WHOIS data
 */
function parseWhoisData(whoisText, domain) {
  if (!whoisText || whoisText.trim().length === 0) {
    return null;
  }

  const lines = whoisText.split('\n');
  const data = {
    domain: domain,
    registrar: null,
    registrarUrl: null,
    creationDate: null,
    expirationDate: null,
    updatedDate: null,
    status: [],
    nameServers: [],
    dnssec: null,
    raw: whoisText
  };

  // Common regex patterns for WHOIS fields
  const patterns = {
    domain: /^(?:Domain Name|domain):\s*(.+)$/im,
    registrar: /^(?:Registrar|registrar):\s*(.+)$/im,
    registrarUrl: /^(?:Registrar URL|registrar url|Registry Domain ID):\s*(https?:\/\/.+)$/im,
    creationDate: /^(?:Creation Date|created(?: on)?|Registered On|registration date):\s*(.+)$/im,
    expirationDate: /^(?:Registry Expiry Date|Expiry Date|expires?(?: on)?|expiration date|expire):\s*(.+)$/im,
    updatedDate: /^(?:Updated Date|last-updated|last modified|last update|updated):\s*(.+)$/im,
    status: /(?:Status|status):\s*(.+)$/gim,
    nameServers: /^(?:Name Server|nserver|nameserver):\s*(.+)$/gim,
    dnssec: /^(?:DNSSEC|dnssec):\s*(.+)$/im
  };

  // Extract single-value fields
  const domainMatch = whoisText.match(patterns.domain);
  if (domainMatch) data.domain = domainMatch[1].trim();

  const registrarMatch = whoisText.match(patterns.registrar);
  if (registrarMatch) data.registrar = registrarMatch[1].trim();

  const registrarUrlMatch = whoisText.match(patterns.registrarUrl);
  if (registrarUrlMatch) data.registrarUrl = registrarUrlMatch[1].trim();

  const creationMatch = whoisText.match(patterns.creationDate);
  if (creationMatch) data.creationDate = normalizeDate(creationMatch[1].trim());

  const expirationMatch = whoisText.match(patterns.expirationDate);
  if (expirationMatch) data.expirationDate = normalizeDate(expirationMatch[1].trim());

  const updatedMatch = whoisText.match(patterns.updatedDate);
  if (updatedMatch) data.updatedDate = normalizeDate(updatedMatch[1].trim());

  const dnssecMatch = whoisText.match(patterns.dnssec);
  if (dnssecMatch) data.dnssec = dnssecMatch[1].trim();

  // Extract multi-value fields
  let statusMatch;
  while ((statusMatch = patterns.status.exec(whoisText)) !== null) {
    const status = statusMatch[1].trim();
    if (status && !data.status.includes(status)) {
      data.status.push(status);
    }
  }

  let nsMatch;
  while ((nsMatch = patterns.nameServers.exec(whoisText)) !== null) {
    const ns = nsMatch[1].trim().toLowerCase();
    if (ns && !data.nameServers.includes(ns)) {
      data.nameServers.push(ns);
    }
  }

  // Calculate domain age and remaining time
  if (data.creationDate) {
    data.age = calculateAge(data.creationDate);
  }

  if (data.expirationDate) {
    data.remaining = calculateRemaining(data.expirationDate);
    data.gracePeriod = isInGracePeriod(data.expirationDate);
    data.redemptionPeriod = isInRedemptionPeriod(data.expirationDate);
    data.pendingDelete = isPendingDelete(data.expirationDate, data.status);
  }

  return data;
}

/**
 * Normalize date string to ISO8601 format
 * @param {string} dateStr - Date string from WHOIS
 * @returns {string|null} ISO8601 date string or null
 */
function normalizeDate(dateStr) {
  if (!dateStr) return null;

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  } catch (e) {
    return null;
  }
}

/**
 * Calculate domain age in human-readable format
 * @param {string} creationDate - Creation date (YYYY-MM-DD)
 * @returns {string} Human-readable age (e.g., "29Y 8Mo 15D")
 */
function calculateAge(creationDate) {
  const created = new Date(creationDate);
  const now = new Date();
  return formatDateDiff(created, now);
}

/**
 * Calculate remaining time until expiration
 * @param {string} expirationDate - Expiration date (YYYY-MM-DD)
 * @returns {string} Human-readable remaining time
 */
function calculateRemaining(expirationDate) {
  const expires = new Date(expirationDate);
  const now = new Date();
  return formatDateDiff(now, expires);
}

/**
 * Format date difference in human-readable format
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string} Formatted difference
 */
function formatDateDiff(startDate, endDate) {
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years}Y`);
  if (months > 0) parts.push(`${months}Mo`);
  if (days > 0) parts.push(`${days}D`);

  return parts.join(' ') || '0D';
}

/**
 * Check if domain is in grace period (within 30 days of expiration)
 * @param {string} expirationDate - Expiration date
 * @returns {boolean}
 */
function isInGracePeriod(expirationDate) {
  const expires = new Date(expirationDate);
  const now = new Date();
  const diffDays = (expires - now) / (1000 * 60 * 60 * 24);
  return diffDays <= 30 && diffDays > 0;
}

/**
 * Check if domain is in redemption period (expired but not deleted)
 * @param {string} expirationDate - Expiration date
 * @returns {boolean}
 */
function isInRedemptionPeriod(expirationDate) {
  const expires = new Date(expirationDate);
  const now = new Date();
  const diffDays = (now - expires) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= 30;
}

/**
 * Check if domain is pending delete
 * @param {string} expirationDate - Expiration date
 * @param {Array} status - Domain status array
 * @returns {boolean}
 */
function isPendingDelete(expirationDate, status) {
  return status.some(s => s.toLowerCase().includes('pendingdelete'));
}

module.exports = {
  parseWhoisData
};
