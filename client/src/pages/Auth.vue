<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import type { Payload } from 'altcha-lib/types'
import BaseLayout from '../layouts/BaseLayout.vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Altcha from '../components/Altcha.vue'
import Modal from '../components/Modal.vue'
import { useAuthStore, useLayoutStore } from '../stores/index.ts'
import { isAuthCode, isEmail } from '../utils.ts'
// import Debug from '../components/Debug.vue'

const PayloadSchema = z.custom<Payload>()

const layout = useLayoutStore()
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const isCodeModalVisible = ref(false)

const email = ref<string | undefined>()
const code = ref<string | undefined>()
const altchaPayload = ref<Payload | undefined>()

const isValidEmail = computed(() => isEmail(email.value))
const isValidAltcha = computed(() => PayloadSchema.safeParse(altchaPayload.value).success)
const isValidAuthCode = computed(() => isAuthCode(code.value))

const secondsLeft = ref<number | undefined>(0)
const attemptsLeft = ref<number | undefined>(0)

let interv: any

function setTimer(date: Date) {
  clearInterval(interv)
  secondsLeft.value = Math.floor((date.getTime() - Date.now()) / 1000)
  interv = setInterval(() => {
    secondsLeft.value = secondsLeft.value! - 1
    if (secondsLeft.value < 0) {
      secondsLeft.value = 0
      isCodeModalVisible.value = false
      clearInterval(interv)
    }
  }, 1000)
}

async function requestAuthCode() {
  const altcha = { ...altchaPayload.value } as NonNullable<Payload>
  const payload = { email: email.value, altcha }
  const res = await auth.sendAuthCode(payload)
  if (res.success) {
    attemptsLeft.value = res.data.attempts
    setTimer(new Date(res.data.expiresAt))
    code.value = undefined
    isCodeModalVisible.value = true
  } else {
    layout.showDangerAlert(res.error)
  }
}

async function sendAuthCode() {
  const res = await auth.submitAuthCode({ code: code.value! })

  if (!res.success) {
    layout.showDangerAlert(res.error)
    if (res.data) {
      attemptsLeft.value = res.data.attempts
      setTimer(new Date(res.data.expiresAt))
      if (res.data.attempts === 0) {
        isCodeModalVisible.value = false
      }
      return
    }
  }

  if (route.query.r) {
    return router.replace({ name: `${route.query.r}` })
  }

  return router.replace({ name: 'home' })
}
</script>

<template>
  <BaseLayout>
    <div class="grow bg-shade-lightest flex flex-col justify-center items-center text-center px-4 py-8">
      <h1 class="font-bold text-2xl text-primary mb-4">Autenticação</h1>
      <Card class="max-w-xs w-full">
        <form class="flex flex-col gap-4" @submit.prevent="requestAuthCode">
          <input type="email" v-model="email" placeholder="Email" required />
          <Altcha v-model="altchaPayload" @error="(err) => console.warn(err)" />
          <!-- <Debug :data="altchaPayload" /> -->
          <Button class="mx-auto" :disabled="!isValidEmail || !isValidAltcha" type="submit">Entrar</Button>
        </form>
      </Card>

      <Modal v-model="isCodeModalVisible" class="max-w-sm">
        <div class="pt-4 pb-2">
          <p class="text-shade leading-tight mb-4 text-sm">
            Foi enviado um email com um código de 3 caracteres para se autenticar. Por favor verifique o seu email.
          </p>

          <form class="flex flex-col" @submit.prevent="sendAuthCode">
            <div class="flex flex-col justify-center">
              <label for="code" class="font-bold text-primary text-lg tracking-tight mb-2 text-center">
                Código de autenticação
              </label>

              <input
                v-model="code"
                type="text"
                :minlength="3"
                :maxlength="3"
                id="code"
                name="code"
                placeholder=""
                class="text-xl py-2 px-3 appearance-none mx-auto !w-20 text-center font-bold tracking-widest"
                @input="code = code?.toUpperCase()"
              />
            </div>

            <p class="text-shade mb-6 text-sm leading-tight mt-6">
              Tens {{ attemptsLeft == undefined ? 0 : attemptsLeft }} tentativas e {{
                secondsLeft == undefined ? 0 : secondsLeft
              }} segundos para<br />
              introduzir o código corretamente.
            </p>

            <Button class="mx-auto" :disabled="!isValidAuthCode" type="submit">Entrar</Button>
          </form>
        </div>
      </Modal>
    </div>
  </BaseLayout>
</template>
