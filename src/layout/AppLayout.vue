<template>
  <el-container>
    <el-aside>
      <el-scrollbar>
        <AppMenu />
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader />
      </el-header>
      <el-main :class="theme" id="app-main">
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
import { provide, ref } from 'vue'
import AppFooter from './AppFooter/index.vue'
const theme = ref<string>('darkblue')
const themes = ref<string[]>(['darkblue', 'dark', 'primary'])
const index = ref<number>(0)
provide('theme', theme.value)
const changeTheme = () => {
  theme.value = themes.value[index.value % 3]
  index.value++
}
provide('changeTheme', changeTheme)
</script>

<style lang="scss" scoped>
.el-container {
  height: 100vh;
  .el-aside {
    width: auto;
    background-color: $bgColor;
    color: #333;
  }
  .el-container {
    .el-header {
      background-color: #fff;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .el-main {
      background-color: #e9eef3;
      color: #333;
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }
}

</style>
