/**
 * Client-side price service
 * Static price list for common TLDs
 */

// Static price list for common TLDs (in USD)
const priceList = {
  'com': { registration: 10.99, renewal: 12.99, transfer: 10.99 },
  'net': { registration: 12.99, renewal: 14.99, transfer: 12.99 },
  'org': { registration: 11.99, renewal: 13.99, transfer: 11.99 },
  'info': { registration: 3.99, renewal: 18.99, transfer: 15.99 },
  'biz': { registration: 4.99, renewal: 17.99, transfer: 15.99 },
  'io': { registration: 39.99, renewal: 49.99, transfer: 39.99 },
  'co': { registration: 9.99, renewal: 29.99, transfer: 29.99 },
  'me': { registration: 4.99, renewal: 19.99, transfer: 19.99 },
  'tv': { registration: 9.99, renewal: 34.99, transfer: 34.99 },
  'xyz': { registration: 1.99, renewal: 13.99, transfer: 13.99 },
  'online': { registration: 2.99, renewal: 39.99, transfer: 39.99 },
  'store': { registration: 2.99, renewal: 59.99, transfer: 59.99 },
  'tech': { registration: 6.99, renewal: 54.99, transfer: 54.99 },
  'site': { registration: 2.99, renewal: 32.99, transfer: 32.99 },
  'app': { registration: 14.99, renewal: 18.99, transfer: 18.99 },
  'dev': { registration: 12.99, renewal: 15.99, transfer: 15.99 },
  'cn': { registration: 8.99, renewal: 8.99, transfer: 8.99 },
  'uk': { registration: 8.99, renewal: 8.99, transfer: 8.99 },
  'de': { registration: 6.99, renewal: 6.99, transfer: 6.99 },
  'jp': { registration: 34.99, renewal: 34.99, transfer: 34.99 },
  'ru': { registration: 5.99, renewal: 5.99, transfer: 5.99 },
  'au': { registration: 12.99, renewal: 12.99, transfer: 12.99 },
  'ca': { registration: 14.99, renewal: 14.99, transfer: 14.99 },
  'fr': { registration: 9.99, renewal: 9.99, transfer: 9.99 },
  'it': { registration: 9.99, renewal: 9.99, transfer: 9.99 },
  'nl': { registration: 9.99, renewal: 9.99, transfer: 9.99 },
  'eu': { registration: 8.99, renewal: 8.99, transfer: 8.99 },
  'in': { registration: 8.99, renewal: 8.99, transfer: 8.99 },
  'us': { registration: 8.99, renewal: 8.99, transfer: 8.99 }
};

/**
 * Get pricing information for a domain TLD
 * @param {string} tld - Top-level domain
 * @returns {Object|null} Pricing data or null if not found
 */
export function getPrices(tld) {
  const prices = priceList[tld.toLowerCase()];

  if (!prices) {
    // Return default pricing for unknown TLDs
    return {
      registration: 15.99,
      renewal: 15.99,
      transfer: 15.99,
      currency: 'USD',
      note: 'Default pricing for unknown TLD'
    };
  }

  return {
    ...prices,
    currency: 'USD'
  };
}
