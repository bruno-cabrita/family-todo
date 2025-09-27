<script setup lang="ts">
import MainLayout from '../layouts/MainLayout.vue'
import Card from '../components/ui/Card.vue'
</script>

<template>
  <MainLayout>
    <div class="py-6 px-4">
      <h1 class="font-bold text-4xl text-primary mb-4">Hello Vite!</h1>
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
    </div>
  </MainLayout>
</template>
