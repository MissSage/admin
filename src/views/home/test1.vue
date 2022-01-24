<template>
  <div class="test">
    <LgsForm
      ref="refLgsForm"
      :data-form="dataForm"
      :rules="rules"
      :form-fields="formFields"
      :btns="btns"
    />
  </div>
</template>
<script lang='ts'>
import { IFormRuleMap } from '@/types/element-plus'
import { ILgsFormBtn, ILgsFormItem } from '@/types/LgsFormItem'
import { defineComponent, getCurrentInstance, PropType, reactive, ref, toRefs } from 'vue'
import LgsForm from '../../components/LgsForm/index.vue'

export default defineComponent({
  name: 'Test',
  components: { LgsForm },
  emits: ['close'],
  setup (props, ctx) {
    const refLgsForm = ref<InstanceType<typeof LgsForm>>()
    const state = reactive<{
      dataForm:Record<string, string>
      formFields:ILgsFormItem[]
      rules:IFormRuleMap
      btns:ILgsFormBtn[]
    }>({
      dataForm: {
        field1: '1',
        field2: ''
      },
      formFields: [{
        type: 'select',
        label: 'select',
        options: [
          { label: '1', value: '1' },
          { label: '2', value: '2' }
        ],
        field: 'field1'
      }, {
        type: 'input',
        label: 'input',
        field: 'field2'
      }, {
        label: 'date',
        type: 'date',
        field: 'field3'
      }, {
        type: 'daterange',
        label: 'daterange',

        field: 'field4'
      }],
      rules: {
        field2: [{ required: true, message: '此项不能为空', trigger: 'blur' }]
      },
      btns: [
        { text: '提交', disabled: false, click: () => handleClick(), type: 'primary', icon: 'icon-check' },
        { text: '取消', click: () => handleCancel(), icon: 'icon-close' }
      ]
    })
    const handleClick = () => {
      if (!refLgsForm.value) return
      refLgsForm.value.submit()
    }
    const handleCancel = () => {
      ctx.emit('close')
    }
    return {
      ...toRefs(state),
      refLgsForm
    }
  }
})
</script>
<style scoped lang='scss'>

</style>
