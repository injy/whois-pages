<template>
  <div class="data-grid" v-if="data && Object.keys(data).length > 0">
    <template v-for="(value, key) in displayData" :key="key">
      <span class="data-label">{{ formatLabel(key) }}:</span>
      <span class="data-value">
        <template v-if="Array.isArray(value)">
          <ul class="multi-value-list">
            <li v-for="(item, index) in value" :key="index" class="multi-value-item">
              <a v-if="isUrl(item)" :href="item" target="_blank" rel="noopener noreferrer">{{ item }}</a>
              <span v-else>{{ item }}</span>
            </li>
          </ul>
        </template>
        <template v-else-if="isUrl(value)">
          <a :href="value" target="_blank" rel="noopener noreferrer">{{ value }}</a>
        </template>
        <template v-else>
          {{ value }}
        </template>
      </span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
});

const displayData = computed(() => {
  if (!props.data) return {};

  const result = {};

  // Only include non-null, non-empty values
  const fields = [
    'registrar',
    'registrarUrl',
    'creationDate',
    'expirationDate',
    'updatedDate',
    'status',
    'nameServers',
    'dnssec',
    'age',
    'remaining'
  ];

  fields.forEach(field => {
    if (props.data[field]) {
      result[field] = props.data[field];
    }
  });

  return result;
});

const formatLabel = (key) => {
  const labels = {
    registrar: 'Registrar',
    registrarUrl: 'Registrar URL',
    creationDate: 'Created',
    expirationDate: 'Expires',
    updatedDate: 'Updated',
    status: 'Status',
    nameServers: 'Name Servers',
    dnssec: 'DNSSEC',
    age: 'Age',
    remaining: 'Remaining'
  };
  return labels[key] || key;
};

const isUrl = (value) => {
  if (typeof value !== 'string') return false;
  return value.startsWith('http://') || value.startsWith('https://');
};
</script>
