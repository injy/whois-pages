<template>
  <footer class="footer">
    <p>
      WHOIS Domain Lookup &copy; {{ currentYear }} |
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
    </p>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>
