<script setup lang="ts">
import { ref } from 'vue'

const isChecked = ref(false)

const emit = defineEmits(['change'])

function handleCheckboxChange() {
  isChecked.value = !isChecked.value
  emit('change', isChecked.value)
}
</script>

<template>
  <label class="flex cursor-pointer select-none items-center rounded-full has-[:focus]:outline-2">
    <div class="relative">
      <input type="checkbox" class="sr-only" @change="handleCheckboxChange" />
      <div :class="{ '!bg-primary': isChecked }" class="block h-6 w-10 rounded-full bg-shade-light"></div>
      <div
        :class="{ 'translate-x-full': isChecked }"
        class="dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition"
      >
      </div>
    </div>
  </label>
</template>
