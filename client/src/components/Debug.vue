<script setup lang="ts">
const props = defineProps<{ data?: any }>()
</script>

<template>
<pre class="rounded-lg bg-black/80 text-white text-xs font-light p-2 text-left overflow-x-auto leading-tight">{{ JSON.stringify(props.data, null, '  ') }}</pre>
</template>
