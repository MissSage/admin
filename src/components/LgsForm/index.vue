<template>
  <el-form
    ref="refLgsForm"
    :label-width="120"
    :model="dataForm"
    :rules="rules"
  >
    <template
      v-for="(item,i) in formFields"
      :key="i"
    >
      <LgsFormItem
        v-model="dataForm[item.field]"
        :config="item"
      />
    </template>
  </el-form>
  <div class="lgs-form-footer">
    <el-button
      v-for="(item,i) in btns"
      :type="item.type||'primary'"
      :key="i"
      :disabled="item.disabled"

      @click="item.click"
    >
      <i class="icon iconfont" :class="item.icon"></i>
      <span>{{ item.text }}</span>
    </el-button>
  </div>
</template>
<script lang='ts'>
import { IElForm, IFormRule, IFormRuleMap } from '@/types/element-plus'
import { ILgsFormBtn, ILgsFormItem } from '@/types/LgsFormItem'
import { ElForm, ElButton } from 'element-plus'
import { defineComponent, PropType, ref } from 'vue'
import LgsFormItem from '../LgsFormItem/index.vue'
type DataForm=Record<string, string>
export default defineComponent({
  name: 'LgsForm',
  components: {
    LgsFormItem,
    ElForm,
    ElButton
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
    },
    rules: {
      type: Object as PropType<IFormRuleMap>,
      default: () => {
        //
      }
    },
    btns: {
      type: Array as PropType<ILgsFormBtn[]>,
      default: () => {
        return []
      }
    }
  },
  setup (props) {
    const refLgsForm = ref<IElForm>()
    const submit = () => {
      if (!refLgsForm.value) return
      refLgsForm.value.validate((isValid:any, results:any) => {
        if (isValid) {
          console.log(props.dataForm)

          console.log('submit!')
        } else {
          console.log(results)

          console.log('error submit!')
          return false
        }
      })
    }
    return {
      refLgsForm,
      submit
    }
  }
})
</script>
<style scoped lang='scss'>
</style>
