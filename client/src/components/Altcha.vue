<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { solveChallengeWorkers, solveChallenge } from 'altcha-lib'
import type { Payload, Challenge } from 'altcha-lib/types'
import workerUrl from 'altcha-lib/worker?worker'
import { rpc } from '../lib/rpc.ts'
import Switch from './ui/Switch.vue'

const modelValue = defineModel()
const emit = defineEmits(['complete', 'error'])
const altchaState = ref('loading')
let altchaChallenge: Challenge

async function solveAltchaChallenge({ challenge, salt, algorithm, signature }): Promise<Payload> {
  const { number } = await solveChallengeWorkers(
    workerUrl, // Worker script URL or path
    8, // Spawn 8 workers
    challenge,
    salt,
  )

  return { challenge, salt, algorithm, signature, number }
}

async function switchChangeHandler(val: boolean) {
  if(!val) return
  altchaState.value = 'verifing'
  if (!altchaChallenge) return altchaState.value = 'error'
  modelValue.value = await solveAltchaChallenge(altchaChallenge)
  altchaState.value = 'complete'
}

onBeforeMount(async () => {
  altchaChallenge = await rpc.altcha.challenge()
    .catch(({message}) => {
      console.warn(message)
      altchaState.value = 'error'
    })
  altchaState.value = 'ready'
})
</script>

<template>
  <div class="w-full flex flex-row items-center gap-3">
    <Switch @change="switchChangeHandler"/>
    <span v-if="altchaState === 'loading'">A carregar...</span>
    <span v-if="altchaState === 'ready'">Sou humano.</span>
    <span v-if="altchaState === 'verifing'">A verificar...</span>
    <span v-if="altchaState === 'error'" class="text-danger">Ocorreu um erro!</span>
    <span v-if="altchaState === 'complete'">Humano confirmado.</span>
  </div>
</template>
