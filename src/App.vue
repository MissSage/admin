<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>
<style lang="scss">

@import "@arcgis/core/assets/esri/themes/dark/main.css";
@import './styles/iconfont/iconfont.css';
@import './styles/index.scss';
</style>
