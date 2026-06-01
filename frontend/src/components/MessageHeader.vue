<template>
  <div class="message-header">
    <svg class="message-icon" viewBox="0 0 16 16" fill="currentColor">
      <!-- Checkmark for positive -->
      <path v-if="type === 'positive'" d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.78 5.22a.75.75 0 00-1.06-1.06L6.5 8.38 5.28 7.16a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l4.75-4.75z"/>

      <!-- X for negative -->
      <path v-else-if="type === 'negative'" d="M8 0a8 8 0 110 16A8 8 0 018 0zm2.54 9.47a.75.75 0 001.06-1.06L9.12 5.97l2.48-2.48a.75.75 0 00-1.06-1.06L8.06 4.91 5.59 2.43a.75.75 0 00-1.06 1.06l2.47 2.48-2.47 2.47a.75.75 0 101.06 1.06l2.47-2.47 2.48 2.47z"/>

      <!-- Info for informative -->
      <path v-else-if="type === 'informative'" d="M8 0a8 8 0 110 16A8 8 0 018 0zm0 12a1 1 0 100 2 1 1 0 000-2zm0-9a1 1 0 00-1 1v5a1 1 0 102 0V4a1 1 0 00-1-1z"/>

      <!-- Warning for notice -->
      <path v-else d="M8 0a8 8 0 110 16A8 8 0 018 0zm0 12a1 1 0 100 2 1 1 0 000-2zm0-9a1 1 0 00-1 1v4a1 1 0 102 0V4a1 1 0 00-1-1z"/>
    </svg>
    <span class="message-title">{{ title }}</span>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['positive', 'negative', 'informative', 'notice'].includes(value)
  },
  title: {
    type: String,
    required: true
  }
});
</script>
