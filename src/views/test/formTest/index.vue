<template>
  <el-button @click="slDialogConfig.visible = true"> 打开表单弹窗 </el-button>
  <SLDialog :config="slDialogConfig">
    <SLForm>
      <SLFormItem />
    </SLForm>
  </SLDialog>
</template>

<script lang="ts">
import SLDialog from '@/components/SLDialog/index.vue'
import SLForm from '@/components/SLForm/index.vue'
import SLFormItem from '@/components/SLFormItem/index.vue'
import { defineComponent, reactive, ref, toRefs } from 'vue'
import {ISLDialogConfig} from '@/components/SLDialog/type'
export default defineComponent({
  name: 'FormTest',
  components: { SLForm, SLFormItem, SLDialog },
  setup() {
    // codes here
    const refForm = ref<InstanceType<typeof SLForm>>()
    const state = reactive<{
      slDialogConfig: ISLDialogConfig
    }>({
      slDialogConfig: {
        visible: false,
        title: '表单测试',
        scrollbar: true,
        confirm: {
          text: '提 交',
          show: true,
          handler: async() => {
            refForm.value && await refForm.value.Submit()
          }
        },
        cancel: {
          text: '关 闭'
        }
      }
    })
    return {
      ...toRefs(state),
      refForm
    }
  }
})
</script>

<style lang="scss" scoped></style>
