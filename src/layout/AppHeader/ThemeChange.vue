<template>
  <el-icon
    @click="()=>changeTheme()"
  >
    <MoonNight v-if="theme==='dark'"></MoonNight>
    <Sunny v-else></Sunny>
  </el-icon>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { MoonNight, Sunny } from '@element-plus/icons-vue'
import { useStore } from '@/store'
const store = useStore()
const changeTheme = () => store.commit('changeTheme')
const theme = computed(() => store.getters._getTheme)
</script>

<style lang="scss" scoped>
.el-icon{
  cursor: pointer;
}
</style>
