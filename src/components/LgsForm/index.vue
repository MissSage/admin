<template>
  <div class="form-wrapper">
    <el-form
      ref="refLgsForm"
      style="width:100%;"
      :label-position="config.labelPosition || 'top'"
      :label-width="120"
      :model="formData"
      :rules="config.rules"
    >
      <template
        v-for="(item,i) in config.columns"
        :key="i"
      >
        <LgsFormItem
          v-model="formData[item.field]"
          :config="item"
        />
      </template>
    </el-form>
    <div class="lgs-form-footer">
      <el-button
        v-for="(item,i) in config.btns"
        :type="item.type||'primary'"
        :key="i"
        :disabled="item.disabled"

        @click="item.click"
      >
        <i class="icon iconfont" :class="item.icon"></i>
        <span>{{ item.text }}</span>
      </el-button>
    </div>
  </div>
</template>
<script lang='ts'>
import { IElForm } from '@/types/element-plus'
import { ElForm, ElButton } from 'element-plus'
import { defineComponent, PropType, reactive, ref, toRefs } from 'vue'
import LgsFormItem from '../LgsFormItem/index.vue'
import { ILgsForm } from './type'

export default defineComponent({
  name: 'LgsForm',
  components: {
    LgsFormItem,
    ElForm,
    ElButton
  },
  props: {
    config: {
      type: Object as PropType<ILgsForm>,
      default: () => {
        //
      }
    }
  },
  setup (props) {
    const refLgsForm = ref<IElForm>()
    const state = reactive<{
      formData:Record<string, any>
    }>({
      formData: {
        ...props.config.defaultValues
      }
    })
    const submit = () => {
      if (!refLgsForm.value) return
      refLgsForm.value.validate((isValid:any, results:any) => {
        if (isValid) {
          console.log(state.formData)

          console.log('submit!')
        } else {
          console.log(results)

          console.log('error submit!')
          return false
        }
      })
    }
    return {
      ...toRefs(state),
      refLgsForm,
      submit
    }
  }
})
</script>
<style scoped lang='scss'>
.form-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width:100%;
  align-items: center;
  flex-basis: 30%;

}
</style>
