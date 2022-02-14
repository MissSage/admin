<template>
  <el-table
    :data="data"
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
          @change="(val:any)=>handleChange(column,scope.row,val)"
        ></lgs-form-item>
        <span v-else>{{ column.formatter?column.formatter(scope.row, column, true):scope.row[column.field] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang='ts'>
import { computed, PropType, ref } from 'vue'
import { ILgsTableColumn, ILgsTableConfig } from './type'
const emit = defineEmits(['update:model-value', 'change'])
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
const data = computed(() => props.modelValue)
const handleChange = (column:ILgsTableColumn, row:any, value:any) => {
  column.onChange && column.onChange(row, value)
  emit('update:model-value', data.value)
  emit('change', data.value)
}
</script>
<style scoped lang='scss'>
</style>
