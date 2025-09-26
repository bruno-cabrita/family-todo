<script setup lang="ts">
import { watchEffect, useTemplateRef } from 'vue'
import { IconX } from '@tabler/icons-vue'
import Card from './ui/Card.vue'

const modelValue = defineModel()

const emit = defineEmits(['closed'])

const modal = useTemplateRef('modal')

function closeHandler() {
  modelValue.value = false
  emit('closed')
}

watchEffect(() => {
  if (modelValue.value) modal.value?.showModal()
  else modal.value?.close()
})

</script>

<template>
  <dialog
    ref="modal"
    class="top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-lg p-4 bg-transparent overflow-hidden focus:outline-0"
    @close="closeHandler"
  >
    <Card class="shadow-md">
      <button class="absolute top-1 right-1 text-shade p-1 rounded-lg cursor-pointer transition-colors hover:text-shade-dark" @click="closeHandler">
        <IconX/>
      </button>
      <slot/>
    </Card>
  </dialog>
</template>

<style lang="css" scoped>
dialog::backdrop {
  background-color: rgb(from var(--color-shade-lightest) r g b / 40%);
  backdrop-filter: blur(8px);
}
</style>