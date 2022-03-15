<template>
  <el-icon @click="toggleFullScreen">
    <FullScreen></FullScreen>
  </el-icon>
</template>

<script lang="ts" setup>import { computed } from 'vue'
import { FullScreen } from '@element-plus/icons-vue'
const fullFlag = computed(() => document.fullscreenElement === null)
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon{
  cursor: pointer;
}
</style>
