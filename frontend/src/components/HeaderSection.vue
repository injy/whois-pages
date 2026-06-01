<template>
  <header class="header-section">
    <div class="container">
      <h1 class="header-title">
        <a href="/">WHOIS Domain Lookup</a>
      </h1>

      <form class="search-form" @submit.prevent="handleSearch">
        <SearchInput
          v-model="domain"
          @search="handleSearch"
        />
        <SearchButton :loading="isLoading" />
      </form>

      <CheckboxGroup v-model="dataSource" />
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import SearchInput from './SearchInput.vue';
import SearchButton from './SearchButton.vue';
import CheckboxGroup from './CheckboxGroup.vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['search', 'update:dataSource']);

const domain = ref('');
const dataSource = ref(['whois']);

// Load saved data source from localStorage
const savedDataSource = localStorage.getItem('whois-dataSource');
if (savedDataSource) {
  try {
    dataSource.value = JSON.parse(savedDataSource);
  } catch (e) {
    // Ignore parse errors
  }
}

// Save data source to localStorage when it changes
watch(dataSource, (newValue) => {
  localStorage.setItem('whois-dataSource', JSON.stringify(newValue));
  emit('update:dataSource', newValue);
}, { deep: true });

const handleSearch = () => {
  if (domain.value.trim()) {
    emit('search', domain.value.trim(), dataSource.value);
  }
};

// Expose domain for external access
defineExpose({
  domain,
  setDomain: (value) => {
    domain.value = value;
  }
});
</script>
