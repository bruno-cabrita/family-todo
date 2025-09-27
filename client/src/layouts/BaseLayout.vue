<script setup lang="ts">
import StateAlert from '../components/StateAlert.vue'
</script>

<template>
  <div class="bg-shade-lightest">
    <div class="min-h-dvh flex flex-col max-w-2xl mx-auto relative">
      <slot/>
    </div>
    <StateAlert/>
  </div>
</template>