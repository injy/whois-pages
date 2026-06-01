<template>
  <div class="messages-section" v-if="result || error">
    <div class="container">
      <!-- Error message -->
      <div v-if="error" class="message-card message-negative">
        <MessageHeader type="negative" :title="error" />
      </div>

      <!-- Success messages -->
      <template v-else-if="result">
        <!-- WHOIS Result -->
        <div v-if="result.whois" class="message-card" :class="getMessageClass(result.whois)">
          <MessageHeader
            :type="getMessageType(result.whois)"
            :title="getMessageTitle(result.whois)"
          />

          <PriceDisplay
            :show-prices="dataSource.includes('prices')"
            :is-loading="pricesLoading"
            :prices="prices"
          />

          <DataGrid :data="result.whois" />

          <TagGroup :tags="result.whois.status || []" />
        </div>

        <!-- RDAP Result -->
        <div v-if="result.rdap" class="message-card message-informative">
          <MessageHeader
            type="informative"
            title="RDAP Information"
          />
          <div class="data-grid">
            <span class="data-label">Handle:</span>
            <span class="data-value">{{ result.rdap.handle || 'N/A' }}</span>

            <span class="data-label">RDAP Conformance:</span>
            <span class="data-value">
              {{ (result.rdap.rdapConformance || []).join(', ') }}
            </span>
          </div>
        </div>

        <!-- Not found / Available -->
        <div
          v-if="result.available"
          class="message-card message-informative"
        >
          <MessageHeader
            type="informative"
            title="Domain is available for registration"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import MessageHeader from './MessageHeader.vue';
import PriceDisplay from './PriceDisplay.vue';
import DataGrid from './DataGrid.vue';
import TagGroup from './TagGroup.vue';

defineProps({
  result: {
    type: Object,
    default: null
  },
  error: {
    type: String,
    default: null
  },
  dataSource: {
    type: Array,
    default: () => ['whois']
  },
  prices: {
    type: Object,
    default: null
  },
  pricesLoading: {
    type: Boolean,
    default: false
  }
});

const getMessageClass = (whoisData) => {
  if (!whoisData) return 'message-notice';

  // Check if domain is registered
  if (whoisData.registrar || whoisData.creationDate) {
    return 'message-positive';
  }

  return 'message-notice';
};

const getMessageType = (whoisData) => {
  if (!whoisData) return 'notice';

  if (whoisData.registrar || whoisData.creationDate) {
    return 'positive';
  }

  return 'notice';
};

const getMessageTitle = (whoisData) => {
  if (!whoisData) return 'No information available';

  const domain = whoisData.domain || 'Domain';

  if (whoisData.registrar || whoisData.creationDate) {
    return `${domain} is registered`;
  }

  return `${domain} - No WHOIS data`;
};
</script>
