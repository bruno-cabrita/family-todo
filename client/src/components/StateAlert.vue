<script setup lang="ts">
import { onMounted } from 'vue'
import { useLayoutStore } from '../stores/index.ts'
import Alert from '../components/Alert.vue'

const layout = useLayoutStore()

function closeHandler() {
  layout.alert.isVisible = false
}

onMounted(() => {
  if(history.state.alertMessage && history.state.alertType) {
    layout.setAlert({
      message: history.state.alertMessage,
      type: history.state.alertType,
    })
    history.state.alertMessage = undefined
    history.state.alertType = undefined
  }
})

</script>

<template>
  <Teleport to="#modals">
    <Transition>
      <div v-if="layout.alert.isVisible" class="fixed z-30 bottom-0 left-0 right-0 px-4 pb-2">
        <Alert
          :type="layout.alert.type"
          @close="closeHandler"
        >
          {{ layout.alert.message }}
        </Alert>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  translate: 0 2rem;
}
</style>