
<template>
  <LgsForm ref="refLgsForm" :config="lgsFormConfig"></LgsForm>
</template>
<script lang="ts">
import { ILgsForm } from '@/components/LgsForm/type'
import LgsForm from '@/components/LgsForm/index.vue'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Home',
  components: { LgsForm },
  setup () {
    const refLgsForm = ref<InstanceType<typeof LgsForm>>()
    const lgsFormConfig:ILgsForm = {
      btns: [
        {
          text: '确认',
          type: 'primary',
          click: () => {
            refLgsForm.value && refLgsForm.value.submit()
          }
        },
        {
          text: '取消',
          type: 'default',
          click: () => {
            console.log('canceled')
          }
        }
      ],
      columns: [
        { label: '名称', field: 'name', type: 'input' },
        { label: '年龄', field: 'age', type: 'number' },
        {
          label: '民族',
          field: 'nation',
          type: 'select',
          options: [
            { label: '汉族', value: '汉族' },
            { label: '其它', value: '其它' }
          ]
        },
        {
          label: '家属',
          field: 'family',
          type: 'table',
          config: {
            columnIndex: true,
            columnCheck: true,
            columns: [{
              label: '姓名',
              field: 'name',
              formItem: {
                type: 'input', field: 'name'
              }
            }, {
              label: '姓名',
              field: 'name',
              formItem: {
                type: 'input', field: 'name'
              }
            }, {
              label: '职业',
              field: 'job',
              formItem: {
                type: 'input', field: 'job'
              }
            }, {
              label: '年龄',
              field: 'age',
              formItem: {
                type: 'number', field: 'age'
              }
            }, {
              label: '关系',
              field: 'relation',
              formItem: {
                type: 'input', field: 'relation'
              }
            }]
          }
        }
      ],
      defaultValues: {
        name: '李四',
        age: 26,
        nation: '汉族',
        family: [{ name: '张三', job: '农民', age: 41, relation: '母亲' },
          { name: '李二', job: '农民', age: 21, relation: '弟弟' },
          { name: '王二', job: '工人', age: 24, relation: '妻子' }]
      }
    }
    return {
      refLgsForm,
      lgsFormConfig
    }
  }
})

</script>

<style lang="scss" scoped>

</style>
