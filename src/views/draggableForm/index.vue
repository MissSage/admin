<template>
  <DraggableForm @save="save" :user-components="userComponents" />
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import DraggableForm from '@/components/FormDraggable/index.vue'

const userComponents = ref<any[]>([])
const save = (options: any) => {
  ElMessage.success('可以将当前配置保存到数据库中用于二次维护')
  console.log(JSON.stringify(options))
}
</script>

<style lang='scss' scoped>
</style>
