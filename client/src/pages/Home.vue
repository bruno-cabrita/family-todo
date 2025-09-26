<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { rpc } from '../lib/rpc.ts'
import Card from '../components/ui/Card.vue'

const data = ref('loading...')

onBeforeMount(async () => {
  const res = await rpc.altcha.challenge()
    .catch(({message}) => console.log(message))

  data.value = res
})
</script>

<template>
  <div class="p-6">
    <h1 class="font-bold text-4xl text-purple-700 mb-4">Hello Vite!</h1>
    <Card class="mb-4">
      <h2 class="font-semibold text-xl mb-2">Title</h2>
      <p class="leading-tight mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, inventore dolorum? Doloribus, distinctio
        sint? Ullam illum veniam, provident corporis ad doloribus. Velit dolores corporis hic nobis quis odit sunt
        dicta.
      </p>
      <p class="leading-tight mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, inventore dolorum? Doloribus, distinctio
        sint? Ullam illum veniam, provident corporis ad doloribus. Velit dolores corporis hic nobis quis odit sunt
        dicta.
      </p>
      <p class="leading-tight">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, inventore dolorum? Doloribus, distinctio
        sint? Ullam illum veniam, provident corporis ad doloribus. Velit dolores corporis hic nobis quis odit sunt
        dicta.
      </p>
    </Card>
    <Card class="mb-4">
      <pre class="leading-tight text-xs mb-4">{{ JSON.stringify(data, null, '  ') }}</pre>
    </Card>
  </div>
</template>
