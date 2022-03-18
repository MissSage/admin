<template>
  <el-space size="large">
    <ToggleSidebar />
    <Breadcrumb />
  </el-space>
  <el-space size="large">
    <template v-if="isMobile">
      <FullScreen />
    </template>
    <template v-else>
      <MenuSearch />
      <ThemeChange />
      <FullScreen />
      <Notification />
      <UserInfo />
    </template>
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
import { useStore } from '@/store'
const store = useStore()
const isMobile = store.state.isMobile
</script>
<style lang="scss" scoped>
</style>
