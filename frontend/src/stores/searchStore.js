import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { queryRdap } from '../services/rdapService';
import { getPrices } from '../services/priceService';

// Use relative URL for same-server deployment, or env var for separate deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useSearchStore = defineStore('search', () => {
  // State
  const domain = ref('');
  const dataSource = ref(['whois']);
  const activeTab = ref('whois');
  const result = ref(null);
  const prices = ref(null);
  const isLoading = ref(false);
  const pricesLoading = ref(false);
  const error = ref(null);

  // Getters
  const hasResult = computed(() => !!result.value);
  const hasError = computed(() => !!error.value);
  const showPrices = computed(() => dataSource.value.includes('prices'));
  const showWhois = computed(() => dataSource.value.includes('whois'));
  const showRdap = computed(() => dataSource.value.includes('rdap'));

  // Actions
  function setDomain(value) {
    domain.value = value;
  }

  function toggleDataSource(source) {
    const index = dataSource.value.indexOf(source);
    if (index > -1) {
      // Don't allow unchecking both whois and rdap
      if ((source === 'whois' || source === 'rdap') && dataSource.value.length <= 1) {
        return;
      }
      dataSource.value.splice(index, 1);
    } else {
      dataSource.value.push(source);
    }
  }

  function setActiveTab(tab) {
    activeTab.value = tab;
  }

  async function executeSearch() {
    if (!domain.value.trim()) {
      error.value = 'Please enter a domain name';
      return;
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain.value.trim())) {
      error.value = 'Invalid domain format';
      return;
    }

    isLoading.value = true;
    error.value = null;
    result.value = null;
    prices.value = null;

    try {
      const searchDomain = domain.value.trim();
      const promises = [];

      // Query WHOIS if selected (requires backend API)
      if (showWhois.value) {
        promises.push(
          axios.get(`${API_BASE_URL}/whois`, {
            params: { domain: searchDomain }
          }).then(res => res.data).catch(err => ({
            code: 1,
            msg: err.message,
            data: null
          }))
        );
      }

      // Query RDAP if selected (client-side)
      if (showRdap.value) {
        promises.push(
          (async () => {
            try {
              const parts = searchDomain.split('.');
              const tld = parts[parts.length - 1];
              const rdapData = await queryRdap(searchDomain, tld);
              return {
                code: 0,
                msg: 'Query successful',
                data: rdapData
              };
            } catch (err) {
              return {
                code: 1,
                msg: err.message,
                data: null
              };
            }
          })()
        );
      }

      // Wait for all queries to complete
      const results = await Promise.all(promises);

      let whoisData = null;
      let rdapData = null;
      let resultIndex = 0;

      if (showWhois.value) {
        whoisData = results[resultIndex++];
      }

      if (showRdap.value) {
        rdapData = results[resultIndex++];
      }

      // Build result object
      result.value = {
        whois: whoisData?.code === 0 ? whoisData.data : null,
        rdap: rdapData?.code === 0 ? rdapData.data : null,
        available: whoisData?.data?.available || false
      };

      // Check for errors
      if (whoisData?.code === 1 && !rdapData) {
        error.value = whoisData.msg;
      }

      // Query prices if selected
      if (showPrices.value) {
        queryPrices(searchDomain);
      }

      // Set active tab based on available data
      if (result.value.whois && result.value.rdap) {
        activeTab.value = 'whois';
      } else if (result.value.rdap) {
        activeTab.value = 'rdap';
      }

    } catch (err) {
      error.value = err.message || 'An error occurred during search';
    } finally {
      isLoading.value = false;
    }
  }

  async function queryPrices(searchDomain) {
    pricesLoading.value = true;

    try {
      // Extract TLD
      const parts = searchDomain.split('.');
      const tld = parts[parts.length - 1];

      // Get prices from client-side service
      const priceData = getPrices(tld);

      // Simulate network delay for realistic UX (minimum 500ms)
      await new Promise(resolve => setTimeout(resolve, 500));

      prices.value = priceData;
    } catch (err) {
      console.error('Price query failed:', err);
    } finally {
      pricesLoading.value = false;
    }
  }

  function clearResult() {
    result.value = null;
    prices.value = null;
    error.value = null;
    activeTab.value = 'whois';
  }

  return {
    domain,
    dataSource,
    activeTab,
    result,
    prices,
    isLoading,
    pricesLoading,
    error,
    hasResult,
    hasError,
    showPrices,
    showWhois,
    showRdap,
    setDomain,
    toggleDataSource,
    setActiveTab,
    executeSearch,
    clearResult
  };
}, {
  persist: {
    key: 'whois-search',
    paths: ['dataSource']
  }
});
