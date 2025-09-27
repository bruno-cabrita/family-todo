<script setup lang="ts">
import { IconMenuDeep, IconX } from '@tabler/icons-vue'
import MainNav from './MainNav.vue'
import Button from './ui/Button.vue'
import { useLayoutStore } from '../stores/index.ts'

const layout = useLayoutStore()

</script>

<template>
  <header class="px-4 py-2 grid grid-cols-5 border-b-2 border-shade-light items-center">
    <div class="col-span-3 col-start-2 text-primary text-center text-lg font-extrabold tracking-wide uppercase">
      Todo
    </div>
    <div class="text-right">
      <button class="p-1 rounded-lg cursor-pointer" @click="layout.showMainNav()">
        <IconMenuDeep />
      </button>
    </div>
  </header>
  <MainNav />
</template>