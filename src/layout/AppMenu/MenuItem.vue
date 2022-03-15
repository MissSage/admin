<template>
  <el-sub-menu
    v-if="menu.children && menu.children.length"
    :index="menu.path"
  >
    <template #title>
      <el-icon class="iconfont" :class="menu.icon"></el-icon>
      <span class="sub-menu-title">{{ menu.title }}</span>
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
    <el-icon class="iconfont" :class="menu.icon"></el-icon>
    <template #title>
      <span>{{ menu.title }}</span>
    </template>
  </el-menu-item>
</template>

<script lang="ts" setup>
import type { PropType } from '@vue/runtime-core'
import type { IMenu } from '@/api/types/common'

defineProps({
  menu: {
    type: Object as PropType<IMenu>,
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
