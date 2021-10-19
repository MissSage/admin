<template>
  <el-menu
    :collapse="$store.state.isCollapse"
    :unique-opened="false"
    :default-active="$route.path"
    class="el-menu"
    background-color="#304156"
    text-color="rgba(255, 255, 255, 0.7)"
    active-text-color="#2d8cf0"
    router
  >
    <menu-item
      v-for="menu in menus"
      :key="menu.path"
      :menu="menu"
    />
  </el-menu>
</template>
<script lang="ts" setup>
import MenuItem from './MenuItem.vue'
import { routes } from '@/router/MenuRoutes'
import { IMenu } from '@/api/types/common'
import { RouteRecordRaw } from 'vue-router'
import { onMounted, ref } from 'vue'
const menus = ref<IMenu[]>([])
const filterMenus = (routes:RouteRecordRaw[]) => {
  const menus = routes.map(item => {
    const menu:IMenu = {
      path: item.path,
      title: item.meta?.title as string,
      icon: item.meta?.icon as string,
      iconLight: item.meta?.iconLight as String,
      header: '',
      is_header: 0,
      children: item.children ? filterMenus(item.children || []) : undefined
    }

    return menu
  })
  return menus
}
onMounted(() => {
  menus.value = filterMenus(routes)
})
</script>
<style lang="scss" scoped>
  .el-menu {
    border-right: none;
  }

  .el-menu:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  ::-webkit-scrollbar {
    display: none;
  }
</style>
