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
import { computed, ref } from 'vue'
import { useStore } from '@/store'
import { RouteRecordRaw } from 'vue-router'
import { routes } from '@/router/MenuRoutes'
const store = useStore()
const theme = computed(() => store.getters._getTheme)
const menus = ref<RouteRecordRaw[]>(routes)

</script>
<style lang="scss" scoped>
</style>
