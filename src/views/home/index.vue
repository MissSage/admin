
<template>
  <h1>home</h1>
  <img
    src="@/assets/logo.png"
    alt="logo"
  >
  <div class="box" />
</template>
<script setup lang="ts">
import { User } from '@/api/user'
console.log(User)
</script>

<style scoped>
.box{
  background: url("@/assets/logo.png")
}
</style>
