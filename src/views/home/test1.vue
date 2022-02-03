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
import { defineComponent, reactive, ref, toRefs } from 'vue'
import LgsForm from '../../components/LgsForm/index.vue'

export default defineComponent({
  name: 'Test',
  components: { LgsForm },
  emits: ['close'],
  setup (props, ctx) {
    const refLgsForm = ref<InstanceType<typeof LgsForm>>()
    const state = reactive<{
      dataForm:Record<string, any>
      formFields:ILgsFormItem[]
      rules:IFormRuleMap
      btns:ILgsFormBtn[]
    }>({
      dataForm: {
        input: '1',
        password: '1',
        textarea: 'qweqwe',
        number: 2,
        selectmultiple: ['value1'],
        select: 'value1',
        cascader: ['childvalue'],
        switch: false,
        radio: '',
        checkbox: [],
        date: '',
        datetime: '',
        daterange: [],
        datetimerange: [],
        time: new Date(),
        timerange: [new Date(), new Date()],
        uploader: '',
        editor: '<h1>qweqwe</h1>'
      },
      formFields: [{
        type: 'input',
        label: 'input',
        field: 'input'
      }, {
        label: 'password',
        type: 'password',
        field: 'password'
      }, {
        type: 'textarea',
        label: 'textarea',

        field: 'textarea'
      }, {
        type: 'number',
        label: 'number',
        controlPosition: 'right',
        field: 'number',
        max: 100,
        min: 0
      }, {
        type: 'select',
        label: 'select',
        options: [
          { label: '1', value: 'value1' },
          { label: '2', value: 'value2' }
        ],
        field: 'select'
      }, {
        type: 'select',
        label: 'selectmultiple',
        multiple: true,
        options: [
          { label: 'label1', value: 'value1', disabled: true },
          { label: 'label2', value: 'value2', data: 'aa' },
          { label: 'label3', value: 'value3', children: [{ label: 'childlabel', value: 'childvalue' }] }
        ],
        field: 'selectmultiple'
      }, {
        type: 'cascader',
        label: 'cascader',
        field: 'cascader',
        checkStrictly: true,
        options: [{ label: 'label1', value: 'value1', disabled: true },
          { label: 'label2', value: 'value2', data: 'aa' },
          { label: 'label3', value: 'value3', children: [{ label: 'childlabel', value: 'childvalue' }] }
        ]
      }, {
        type: 'switch',
        label: 'switch',
        field: 'switch'
      }, {
        type: 'radio',
        label: 'radio',
        field: 'radio',
        options: [
          { label: 'label1', value: 'value1' },
          { label: 'label2', value: 'value2' }
        ]
      }, {
        type: 'checkbox',
        label: 'checkbox',
        field: 'checkbox',
        options: [
          { label: 'label1', value: 'value1' },
          { label: 'label2', value: 'value2' }
        ]
      }, {
        type: 'date',
        label: 'date',
        field: 'date'
      }, {
        type: 'datetime',
        label: 'datetime',
        field: 'datetime'
      }, {
        type: 'daterange',
        label: 'daterange',
        field: 'daterange'
      }, {
        type: 'datetimerange',
        label: 'datetimerange',
        field: 'datetimerange'
      }, {
        type: 'time',
        label: 'time',
        field: 'time'
      }, {
        type: 'time',
        label: 'time',
        field: 'timerange',
        isRange: true
      }, {
      //   type: 'uploader',
      //   label: 'uploader',
      //   field: 'uploader'
      // }, {
        type: 'editor',
        label: 'editor',
        field: 'editor'
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
