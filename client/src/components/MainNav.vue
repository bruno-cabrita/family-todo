<script setup lang="ts">
import { useRouter } from 'vue-router'
import { IconX } from '@tabler/icons-vue'
import Button from './ui/Button.vue'
import { useAuthStore, useLayoutStore } from '../stores/index.ts'

const auth = useAuthStore()
const layout = useLayoutStore()
const router = useRouter()

async function logoutHandler() {
  await auth.logout()
  layout.hideMainNav()
  router.push({ name: 'auth' })
}
</script>

<template>
  <Teleport to="#nav">
    <nav v-if="layout.isMainNavVisible" class="absolute z-20 top-0 bottom-0 left-0 right-0 bg-shade-lightest">
      <div class="max-w-2xl h-full mx-auto flex flex-col">
        <div class="px-4 py-2 flex flex-row justify-end items-center">
          <button class="p-1 rounded-lg cursor-pointer" @click="layout.hideMainNav()">
            <IconX />
          </button>
        </div>
        <div class="grow flex flex-col justify-center items-center gap-4">
          <Button @click="logoutHandler">Logout</Button>
        </div>
      </div>
    </nav>
  </Teleport>
</template>
