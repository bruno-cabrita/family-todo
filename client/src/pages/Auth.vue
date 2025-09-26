<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { z } from 'zod'
import type { AltchaPayload } from '@scope/server/types'
import { AltchaPayloadSchema } from '@scope/server/schemas'
// import { rpc } from '../lib/rpc.ts'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Altcha from '../components/Altcha.vue'
import Modal from '../components/Modal.vue'
import { useAuthStore, useLayoutStore } from '../stores/index.ts'
import { isEmail, isAuthCode } from '../utils.ts'
// import Debug from '../components/Debug.vue'

const layout = useLayoutStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const isCodeModalVisible = ref(false)

const email = ref<string|undefined>()
const code = ref<string|undefined>()
const altchaPayload = ref<AltchaPayload|undefined>()

const isValidEmail = computed(() => isEmail(email.value))
const isValidAltcha = computed(() => AltchaPayloadSchema.safeParse(altchaPayload.value).success)
const isValidAuthCode = computed(() => isAuthCode(code.value))

const secondsLeft = ref<number|undefined>(0)
const attemptsLeft = ref<number|undefined>(0)

let interv: any

function setTimer(date: Date) {
  clearInterval(interv)
  secondsLeft.value = Math.floor((date.getTime() - Date.now())/1000)
  interv = setInterval(() => {
    secondsLeft.value = secondsLeft.value! - 1
    if( secondsLeft.value < 0) {
      secondsLeft.value = 0
      isCodeModalVisible.value = false
      clearInterval(interv)
    }
  }, 1000)
}


async function submit() {
  const payload = { email: email.value, altcha: {...altchaPayload.value} }
  console.log(`submit()`,payload)
  const res = await auth.sendAuthCode(payload)
  if(res.success) {
    attemptsLeft.value = res.data.attempts
    setTimer(new Date(res.data.expiresAt))
    code.value = undefined
    isCodeModalVisible.value = true
  } else {
    // layout.showDangerAlert(res.error)
    console.warn(res.error)
  }
}

</script>

<template>
  <div class="bg-shade-lightest min-h-dvh flex flex-col justify-center items-center text-center px-4 py-8">
    <h1 class="font-bold text-2xl text-primary mb-4">Autenticação</h1>
    <Card class="max-w-xs w-full">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <input type="email" v-model="email" placeholder="Email" required/>
        <Altcha v-model="altchaPayload" @error="(err) => console.warn(err)"/>
        <!-- <Debug :data="altchaPayload" /> -->
        <Button class="mx-auto" :disabled="!isValidEmail || !isValidAltcha">Entrar</Button>
      </form>
    </Card>

    <Modal v-model="isCodeModalVisible">
      modal
    </Modal>
  </div>
</template>
