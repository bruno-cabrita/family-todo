<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { AlertType } from '../types.ts'

const SHOW_TIMEOUT = 5 * 1000 // ms

const props = withDefaults(defineProps<{
  type?: AlertType
}>(), {
  type: 'default',
})

const emit = defineEmits(['close'])

const alertClasses = computed(() => [ `bg-${props.type}` ])

onMounted(() => {
  setTimeout(() => {
    emit('close')
  }, SHOW_TIMEOUT)
})

</script>

<template>
  <div
    role="alert"
    class=" text-center"
  >
    <span class="hidden bg-default bg-info bg-success bg-warning bg-danger"></span>
    <div :class="alertClasses" class="px-5 py-2 rounded-lg shadow-md inline-block">
      <span class="text-sm font-bold text-white">
        <slot>Hello World!</slot>
      </span>
    </div>
  </div>
</template>
