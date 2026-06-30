import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

// Use relative URL for same-server deployment
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

      // Query WHOIS via backend API
      if (showWhois.value) {
        promises.push(
          axios.get(`${API_BASE_URL}/whois`, {
            params: { domain: searchDomain }
          }).then(res => res.data).catch(err => ({
            code: 1,
            msg: err.response?.data?.msg || err.message,
            data: null
          }))
        );
      }

      // Query RDAP via backend API (was client-side direct fetch with CORS issues)
      if (showRdap.value) {
        promises.push(
          axios.get(`${API_BASE_URL}/rdap`, {
            params: { domain: searchDomain }
          }).then(res => res.data).catch(err => ({
            code: 1,
            msg: err.response?.data?.msg || err.message,
            data: null
          }))
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

      // Collect errors from both queries
      const errors = [];
      if (whoisData?.code !== 0 && whoisData?.msg) {
        errors.push(`WHOIS: ${whoisData.msg}`);
      }
      if (rdapData?.code !== 0 && rdapData?.msg) {
        errors.push(`RDAP: ${rdapData.msg}`);
      }
      if (errors.length > 0) {
        error.value = errors.join(' | ');
      }

      // Query prices via backend API if selected
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
      const res = await axios.get(`${API_BASE_URL}/prices`, {
        params: { domain: searchDomain }
      });

      if (res.data.code === 0) {
        prices.value = res.data.data;
      }
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
