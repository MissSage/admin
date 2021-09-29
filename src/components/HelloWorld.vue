<template>
  <h1>{{ count }}</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store/index'
defineProps<{ msg: string }>()

const count = ref(0)
const store = useStore()
count.value = store.state.count
</script>

<style scoped>

</style>
