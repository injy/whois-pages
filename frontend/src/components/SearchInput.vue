<template>
  <div class="search-box">
    <input
      type="text"
      class="search-input"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('search')"
      placeholder="Enter domain name..."
      autocomplete="off"
      spellcheck="false"
    />
    <button
      v-if="modelValue"
      type="button"
      class="search-clear visible"
      @click="$emit('update:modelValue', '')"
      aria-label="Clear search"
    >
      ×
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue', 'search']);
</script>
