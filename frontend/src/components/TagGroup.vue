<template>
  <div class="tag-group" v-if="tags && tags.length > 0">
    <span
      v-for="(tag, index) in tags"
      :key="index"
      class="message-tag"
      :class="getTagClass(tag)"
    >
      {{ formatTag(tag) }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  }
});

const getTagClass = (tag) => {
  const tagLower = tag.toLowerCase();

  if (tagLower.includes('active') || tagLower.includes('ok')) {
    return 'message-tag-green';
  } else if (tagLower.includes('clienttransferprohibited') || tagLower.includes('servertransferprohibited')) {
    return 'message-tag-blue';
  } else if (tagLower.includes('pendingdelete')) {
    return 'message-tag-red';
  } else if (tagLower.includes('redemptionperiod') || tagLower.includes('grace')) {
    return 'message-tag-yellow';
  } else if (tagLower.includes('pending')) {
    return 'message-tag-indigo';
  } else {
    return 'message-tag-gray';
  }
};

const formatTag = (tag) => {
  // Convert camelCase or snake_case to readable format
  return tag
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>
