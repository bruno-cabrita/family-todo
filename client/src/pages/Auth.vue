<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue'
import { z } from 'zod'
// import { rpc } from '../lib/rpc.ts'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Altcha from '../components/Altcha.vue'
import Modal from '../components/Modal.vue'

const AltchaSchema = z.object({
  number: z.number(),
  took: z.number(),
  worker: z.boolean().optional(),
})

const isCodeModalVisible = ref<boolean>(true)
const email = ref<string>()
const altcha = ref<z.infer<typeof AltchaSchema>>()

const isFormValid = computed(() => {
  const isEmail = z.email().safeParse(email.value).success
  const isAltcha = AltchaSchema.safeParse(altcha.value).success
  return isEmail && isAltcha
})

async function submit() {
  console.log(`submit()`, email.value, altcha.value)
}

</script>

<template>
  <div class="bg-shade-lightest min-h-dvh flex flex-col justify-center items-center text-center px-4 py-8">
    <h1 class="font-bold text-2xl text-primary mb-4">Autenticação</h1>
    <Card class="max-w-xs w-full">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <input type="email" v-model="email" placeholder="Email" required/>
        <Altcha v-model="altcha" @error="(err) => console.warn(err)"/>
        <Button class="mx-auto" :disabled="!isFormValid">Entrar</Button>
      </form>
    </Card>

    <Modal :show="isCodeModalVisible" @hide="isCodeModalVisible = false">
      modal
    </Modal>
  </div>
</template>
