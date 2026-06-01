<template>
  <section class="raw-data-section" v-if="showRawData">
    <h2 style="text-align: center; margin-bottom: 16px; font-size: 18px;">
      Raw {{ format === 'json' ? 'RDAP' : 'WHOIS' }} Data
    </h2>
    <div class="raw-data-container" tabindex="0">
      <pre class="raw-data-text"><code v-html="formattedData"></code></pre>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: [String, Object],
    default: null
  },
  format: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'json'].includes(value)
  },
  showRawData: {
    type: Boolean,
    default: false
  }
});

const formattedData = computed(() => {
  if (!props.data) return '';

  if (props.format === 'json') {
    // Format JSON with syntax highlighting
    const jsonStr = typeof props.data === 'string'
      ? props.data
      : JSON.stringify(props.data, null, 2);

    return syntaxHighlightJson(jsonStr);
  } else {
    // Plain text - escape HTML
    return escapeHtml(props.data);
  }
});

const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

const syntaxHighlightJson = (json) => {
  json = escapeHtml(json);

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'token-number';

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'token-property';
        } else {
          cls = 'token-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'token-boolean';
      } else if (/null/.test(match)) {
        cls = 'token-null';
      }

      return `<span class="${cls}">${match}</span>`;
    }
  );
};
</script>
