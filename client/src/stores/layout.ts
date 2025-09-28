import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import type { Alert } from '../types.ts'

export const useLayoutStore = defineStore('layout', () => {
  const alert = reactive<Alert>({
    isVisible: false,
    type: 'success',
    message: '',
  })

  const isMainNavVisible = ref(false)

  function showMainNav() {
    isMainNavVisible.value = true
  }

  function hideMainNav() {
    isMainNavVisible.value = false
  }

  function toggleMainNav() {
    isMainNavVisible.value = !isMainNavVisible.value
  }

  function setAlert(payload: Omit<Alert, 'isVisible'>) {
    alert.message = payload.message
    alert.type = payload.type
    alert.isVisible = true
  }

  function showSuccessAlert(message: string) {
    setAlert({ type: 'success', message })
  }

  function showDangerAlert(message: string) {
    setAlert({ type: 'danger', message })
  }

  return {
    alert,
    setAlert,
    showSuccessAlert,
    showDangerAlert,
    isMainNavVisible,
    showMainNav,
    hideMainNav,
    toggleMainNav,
  }
})
