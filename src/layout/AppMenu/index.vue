<template>
  <el-menu
    :collapse="$store.state.isCollapse"
    :unique-opened="false"
    :default-active="$route.path"
    class="el-menu"
    text-color="#eeeeee"
    background-color="transparent"
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
import { computed, onMounted, ref } from 'vue'
import { useStore } from '@/store'
const store = useStore()
const theme = computed(() => store.getters._getTheme)
const menus = ref<IMenu[]>([])
const filterMenus = (routes:RouteRecordRaw[]) => {
  const menus = routes.filter(item => !(item.meta?.hidden)).map(item => {
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
</style>
