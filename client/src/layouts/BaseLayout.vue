<script setup lang="ts">
import StateAlert from '../components/StateAlert.vue'
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <slot/>
    <StateAlert/>
  </div>
</template>