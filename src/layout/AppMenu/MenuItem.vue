<template>
  <el-sub-menu
    v-if="menu.children && menu.children.length"
    :index="menu.path"
  >
    <template #title>
      <el-icon class="iconfont" :class="menu.meta?.icon"></el-icon>
      <span class="sub-menu-title">{{ menu.meta?.title }}</span>
    </template>
    <MenuItem
      v-for="subMenu in menu.children"
      :key="subMenu.path"
      :menu="subMenu"
    />
  </el-sub-menu>
  <el-menu-item
    v-else
    :index="menu.path"
  >
    <el-icon class="iconfont" :class="menu.meta?.icon"></el-icon>
    <template #title>
      <span>{{ menu.meta?.title }}</span>
    </template>
  </el-menu-item>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  menu: {
    type: Object as PropType<any>,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.menu-icon {
  margin-right: 12px;
}
.sub-menu-title {
  font-size: 16px;
}
</style>
