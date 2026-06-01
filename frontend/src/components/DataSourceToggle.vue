<template>
  <div class="segmented-control" v-if="showToggle">
    <div class="segmented">
      <button
        v-for="option in options"
        :key="option.value"
        class="segmented-item"
        :class="{ 'segmented-item-selected': modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'whois'
  },
  showToggle: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);

const options = [
  { label: 'WHOIS', value: 'whois' },
  { label: 'RDAP', value: 'rdap' }
];
</script>
