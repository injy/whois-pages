<template>
  <div class="home-view">
    <HeaderSection
      ref="headerRef"
      :is-loading="isLoading"
      @search="handleSearch"
      @update:data-source="updateDataSource"
    />

    <main>
      <MessageCard
        :result="result"
        :error="error"
        :data-source="dataSource"
        :prices="prices"
        :prices-loading="pricesLoading"
      />

      <DataSourceToggle
        v-model="activeTab"
        :show-toggle="hasBothSources"
      />

      <RawDataViewer
        :data="rawData"
        :format="activeTab === 'rdap' ? 'json' : 'text'"
        :show-raw-data="hasResult && !error"
      />
    </main>

    <BackToTop />

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSearchStore } from '../stores/searchStore';
import HeaderSection from '../components/HeaderSection.vue';
import MessageCard from '../components/MessageCard.vue';
import DataSourceToggle from '../components/DataSourceToggle.vue';
import RawDataViewer from '../components/RawDataViewer.vue';
import BackToTop from '../components/BackToTop.vue';
import Footer from '../components/Footer.vue';

const route = useRoute();
const store = useSearchStore();
const headerRef = ref(null);

// Computed properties from store
const isLoading = computed(() => store.isLoading);
const result = computed(() => store.result);
const error = computed(() => store.error);
const dataSource = computed(() => store.dataSource);
const activeTab = computed({
  get: () => store.activeTab,
  set: (value) => store.setActiveTab(value)
});
const prices = computed(() => store.prices);
const pricesLoading = computed(() => store.pricesLoading);
const hasResult = computed(() => store.hasResult);

const hasBothSources = computed(() => {
  return result.value?.whois && result.value?.rdap;
});

const rawData = computed(() => {
  if (!result.value) return null;

  if (activeTab.value === 'rdap') {
    return result.value.rdap;
  } else {
    return result.value.whois?.raw || null;
  }
});

const handleSearch = async (domain, dataSource) => {
  store.setDomain(domain);
  store.dataSource = dataSource;
  await store.executeSearch();
};

const updateDataSource = (newDataSource) => {
  store.dataSource = newDataSource;
};

// Handle route params on mount
onMounted(() => {
  if (route.params.domain) {
    const domain = route.params.domain;
    if (headerRef.value) {
      headerRef.value.setDomain(domain);
      handleSearch(domain, dataSource.value);
    }
  }
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}
</style>
