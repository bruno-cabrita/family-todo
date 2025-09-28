<script setup lang="ts">
import BaseLayout from './BaseLayout.vue'
import Header from '../components/Header.vue'
</script>

<template>
  <BaseLayout>
    <Header />
    <main class="grow flex flex-col">
      <slot />
    </main>
  </BaseLayout>
</template>
