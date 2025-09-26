<script setup lang="ts">
import { watchEffect, useTemplateRef } from 'vue'
import IconCloseButton from './assets/IconCloseButton.vue'

const props = withDefaults(defineProps<{
  show?: boolean,
}>(), {
  show: false
})

const emit = defineEmits(['hide'])

const modal = useTemplateRef('modal')

watchEffect(() => {
  if (props.show)  modal.value?.showModal()
  else {
    setTimeout(() => {
      modal.value?.close()
    }, 200)
  }
})
</script>

<template>
  <dialog
    ref="modal"
    class="top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-lg p-4 bg-transparent overflow-hidden focus:outline-0"
    @close="emit('hide')"
  >
    <Transition>
      <div class="flex flex-col" v-if="props.show">
        <div class="shadow-md bg-white p-8 rounded-xl border-2 border-shade-light">
          <button class="ml-auto mb-4 rounded-full" @click="emit('hide')">
            fechar
          </button>
          <slot/>
        </div>
      </div>
    </Transition>
  </dialog>
</template>

<style lang="css" scoped>
dialog::backdrop {
  background-color: rgb(from var(--color-foreground) r g b / 40%);
  backdrop-filter: blur(8px);
}

.v-enter-active {
  transition: opacity 0.2s ease-out;
}

.v-leave-active {
  transition: opacity 0.2s ease-in;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}

</style>