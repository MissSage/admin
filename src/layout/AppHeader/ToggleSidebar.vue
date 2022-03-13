<template>
  <el-icon @click="handleCollapse">
    <Expand v-if="store.state.isCollapse"></Expand>
    <Fold v-else></Fold>
  </el-icon>
  <!-- <i
    :class="collapseIcon"
    @click="handleCollapse"
  /> -->
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { computed } from 'vue'
import { Fold, Expand } from '@element-plus/icons-vue'
const store = useStore()

const handleCollapse = () => {
  store.commit('setIsCollapse', !store.state.isCollapse)
}
</script>

<style lang="scss" scoped></style>
