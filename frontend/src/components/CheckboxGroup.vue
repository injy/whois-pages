<template>
  <div class="checkboxes">
    <div class="checkbox" v-for="option in options" :key="option.value">
      <input
        :id="`checkbox-${option.value}`"
        type="checkbox"
        class="checkbox-trigger"
        :checked="modelValue.includes(option.value)"
        @change="toggleOption(option.value)"
        :disabled="option.value !== 'prices' && isOnlyOption(option.value)"
      />
      <label :for="`checkbox-${option.value}`" class="checkbox-label">
        {{ option.label }}
      </label>
      <div class="checkbox-icon-wrapper">
        <svg class="checkbox-icon-checkmark" viewBox="0 0 12 12">
          <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => ['whois']
  }
});

const emit = defineEmits(['update:modelValue']);

const options = [
  { label: 'WHOIS', value: 'whois' },
  { label: 'RDAP', value: 'rdap' },
  { label: 'PRICES', value: 'prices' }
];

const toggleOption = (value) => {
  const newValue = [...props.modelValue];
  const index = newValue.indexOf(value);

  if (index > -1) {
    // Don't allow unchecking the last required option (whois or rdap)
    const hasWhoisOrRdap = newValue.some(v => v === 'whois' || v === 'rdap');
    if ((value === 'whois' || value === 'rdap') && !hasWhoisOrRdap && newValue.length === 1) {
      return; // Prevent unchecking
    }
    newValue.splice(index, 1);
  } else {
    newValue.push(value);
  }

  // Ensure at least one of whois/rdap is selected
  const hasWhoisOrRdap = newValue.some(v => v === 'whois' || v === 'rdap');
  if (!hasWhoisOrRdap && value !== 'prices') {
    newValue.push('whois');
  }

  emit('update:modelValue', newValue);
};

const isOnlyOption = (value) => {
  return props.modelValue.length === 1 && props.modelValue[0] === value;
};
</script>
