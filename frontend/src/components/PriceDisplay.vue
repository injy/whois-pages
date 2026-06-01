<template>
  <div class="price-display" v-if="showPrices">
    <div v-if="isLoading" class="skeleton"></div>
    <div v-else-if="prices" class="price-tags">
      <span
        v-if="prices.registration"
        class="message-tag message-tag-green"
      >
        Register: ${{ prices.registration }}
      </span>
      <span
        v-if="prices.renewal"
        class="message-tag message-tag-blue"
      >
        Renew: ${{ prices.renewal }}
      </span>
      <span
        v-if="prices.transfer"
        class="message-tag message-tag-purple"
      >
        Transfer: ${{ prices.transfer }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showPrices: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  prices: {
    type: Object,
    default: null
  }
});
</script>
