<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { solveChallengeWorkers } from 'altcha-lib'
import workerUrl from 'altcha-lib/worker?worker'
import { rpc } from '../lib/rpc.ts'
import Switch from './ui/Switch.vue'

const modelValue = defineModel()
const emit = defineEmits(['complete', 'error'])
const altchaState = ref('loading')
let altcha

async function solveAltchaChallenge() {
  altchaState.value = 'verifing'
  if (!altcha) return altchaState.value = 'error'
  const { challenge, salt } = altcha
  modelValue.value = await solveChallengeWorkers(
    workerUrl, // Worker script URL or path
    8, // Spawn 8 workers
    challenge,
    salt,
  )
  altchaState.value = 'complete'
}

async function switchChangeHandler(val: boolean) {
  if(!val) return
  await solveAltchaChallenge()
}

onBeforeMount(async () => {
  altcha = await rpc.altcha.challenge()
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
