<template>
  <div>
    <el-form
      ref="refLgsForm"
      :label-width="120"
      v-model="dataForm"
    >
      <LgsFormItem
        v-for="(item,i) in formFields"
        v-model="dataForm[item.field]"
        :key="i"
        :config="item"
      />
    </el-form>
  </div>
</template>
<script lang='ts'>
import { ILgsFormItem } from '@/types/LgsFormItem'
import { ElForm } from 'element-plus'
import { defineComponent, onMounted, PropType, reactive, toRefs } from 'vue'
import LgsFormItem from '../LgsFormItem/index.vue'
type DataForm=Record<string, string>
export default defineComponent({
  name: 'LgsForm',
  components: {
    LgsFormItem,
    ElForm
  },
  props: {
    dataForm: {
      type: Object as PropType<DataForm>,
      default: () => {

      }
    },
    formFields: {
      type: Array as PropType<ILgsFormItem[]>,
      default: () => {
        return []
      }
    }
  }
})
</script>
<style scoped lang='scss'>
</style>
