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
      <el-main :class="theme">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import AppHeader from './AppHeader/index.vue'
import AppMenu from './AppMenu/index.vue'
import { provide, ref } from 'vue'
const theme = ref<string>('primary')
const themes = ref<string[]>(['normal', 'primary'])

provide('theme', theme.value)
const changeTheme = () => {
  theme.value = theme.value === themes.value[0] ? themes.value[1] : themes.value[0]
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
