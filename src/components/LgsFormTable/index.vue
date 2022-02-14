<template>
  <el-table
    :data="modelValue"
  >
    <el-table-column
      v-if="config.columnIndex"
      type="index"
      width="55"
    />
    <el-table-column
      v-if="config.columnCheck"
      type="selection"
      width="55"
    />
    <!-- 2020.10.10移除table第一行强制排序 -->
    <el-table-column
      v-for="(column, cindex) in config.columns"
      :prop="column.field"
      :label="column.label"
      :min-width="column.width"
      :formatter="column.formatter"
      :key="column.field + cindex"
    >
      <template #default="scope">
        <lgs-form-item
          v-if="column.formItem"
          v-model="scope.row[column.field]"
          :config="column.formItem"
        ></lgs-form-item>
        <span v-else>{{ column.formatter?column.formatter(scope.row, column, true):scope.row[column.field] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang='ts'>
import { PropType, ref } from 'vue'
import { ILgsTableColumn, ILgsTableConfig } from './type'

const props = defineProps({
  config: {
    type: Object as PropType<ILgsTableConfig>,
    default: () => {

    }
  },
  modelValue: {
    default: () => {
      return []
    },
    type: Array as PropType<ILgsTableColumn[]>
  }
})
</script>
<style scoped lang='scss'>
</style>
