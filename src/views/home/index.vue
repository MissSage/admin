
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
          label: 'multiple',
          field: 'multiple',
          type: 'select',
          multiple: true,
          options: [
            { label: '汉族', value: '汉族' },
            { label: '其它', value: '其它' }
          ]
        },
        {
          label: '婚姻状况',
          field: 'marriage',
          type: 'radio',
          options: [
            { label: '已婚', value: '已婚' },
            { label: '未婚', value: '未婚' },
            { label: '未知', value: '未知' }
          ]
        },
        {
          label: '专业',
          field: 'major',
          type: 'checkbox',
          options: [
            { label: '地质', value: '地质' },
            { label: '计算机', value: '计算机' },
            { label: '美术', value: '美术' }
          ]
        },
        {
          label: '家属',
          field: 'family',
          type: 'table',
          config: {
            dataList: [{
              id: 1,
              date: '2016-05-02',
              name: 'wangxiaohu'
            },
            {
              id: 2,
              date: '2016-05-04',
              name: 'wangxiaohu'
            },
            {
              id: 3,
              date: '2016-05-01',
              name: 'wangxiaohu',
              children: [
                {
                  id: 31,
                  date: '2016-05-01',
                  name: 'wangxiaohu'
                },
                {
                  id: 32,
                  date: '2016-05-01',
                  name: 'wangxiaohu'
                }
              ]
            },
            {
              id: 4,
              date: '2016-05-03',
              name: 'wangxiaohu'
            }
            ],
            rowKey: 'id',
            defaultExpandAll: true,
            columnIndex: true,
            columnCheck: true,
            columns: [
              {
                label: 'id',
                field: 'id',
                icon: (row:any, index:number) => {
                  return row.children && row.children.length > 0 ? 'iconfont icon-folder-fill' : 'iconfont icon-file'
                }
              }, {
                label: '姓名',
                field: 'name',
                formItem: {
                  type: 'input', field: 'name'
                }
              }, { label: '生日', field: 'date' }, {
                label: '民族',
                field: 'nation',
                onChange: (row:any, val:any) => {
                  console.log(row, val)

                  row.job = '高危'
                },
                formItem: {
                  type: 'select',
                  field: 'nation',
                  options: [
                    { label: '汉族', value: '汉族' },
                    { label: '其它', value: '其它' }
                  ]
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
        marriage: '已婚',
        major: ['地质'],
        family: [{ name: '张三', job: '农民', age: 41, relation: '母亲', nation: '汉族' },
          { name: '李二', job: '农民', age: 21, relation: '弟弟', nation: '汉族' },
          { name: '王二', job: '工人', age: 24, relation: '妻子', nation: '其它' }]
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
