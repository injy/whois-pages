<template>
  <button
    type="submit"
    class="search-button"
    :disabled="loading"
  >
    <span
      class="search-icon"
      :class="{ searching: loading }"
    >
      🔍
    </span>
    <span class="search-button-text">Search</span>
  </button>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});
</script>
