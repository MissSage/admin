<template>
  <el-container>
    <el-aside>
      <AppMenu />
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import AppHeader from './AppHeader/index.vue'
import AppMenu from './AppMenu/index.vue'
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
    }
  }
}
</style>
