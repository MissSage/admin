<template>
  <div class="lgs-drag">
    <template>
      <slot name="header">
        <div class="lgs-drag-header"></div>
      </slot>
    </template>
    <el-scrollbar>
      <slot></slot>
    </el-scrollbar>
    <div class="lgs-drag-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script setup lang='ts'>

</script>
<style scoped lang='scss'>
</style>
