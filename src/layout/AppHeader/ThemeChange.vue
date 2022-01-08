<template>
  <i
    class="el-icon-full-screen"
    @click="changeTheme"
  />
</template>

<script lang="ts" setup>
import { inject } from 'vue'

const changeTheme = inject('changeTheme') as ()=>void
</script>

<style lang="scss" scoped></style>
