<template>
  <el-space size="large">
    <ToggleSidebar />
    <Breadcrumb />
  </el-space>
  <el-space size="large">
    <MenuSearch />
    <ThemeChange />
    <FullScreen />
    <Notification />
    <UserInfo />
  </el-space>
</template>
<script lang="ts" setup>
import ThemeChange from './ThemeChange.vue'
import ToggleSidebar from './ToggleSidebar.vue'
import Breadcrumb from './Breadcrumb.vue'
import MenuSearch from './MenuSearch.vue'
import FullScreen from './FullScreen.vue'
import Notification from './Notification.vue'
import UserInfo from './UserInfo.vue'
</script>
<style lang="scss" scoped>
</style>
