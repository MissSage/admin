<template>
  <el-container :class="theme">
    <el-aside>
      <AppMenu />
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader />
      </el-header>
      <el-main id="app-main">
        <router-view />
      </el-main>
      <el-footer>
        <AppFooter></AppFooter>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import AppHeader from './AppHeader/index.vue'
import AppMenu from './AppMenu/index.vue'
import AppFooter from './AppFooter/index.vue'
import { useStore } from '@/store'
import { computed } from 'vue'
const store = useStore()
const theme = computed(() => store.getters._getTheme)
</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
  .el-aside {
    width: auto;
    // background-color: $bgColor;
    // color: #333;
  }
  .el-container {
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .el-main {
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }
}

</style>
