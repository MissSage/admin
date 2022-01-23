<template>
  <div class="test">
    <LgsForm :data-form="dataForm" :form-fields="formFields" />
  </div>
</template>
<script lang='ts'>
import { ILgsFormItem } from '@/types/LgsFormItem'
import { defineComponent, PropType } from 'vue'
import LgsForm from '../../components/LgsForm/index.vue'

export default defineComponent({
  name: 'Test',
  props: {
    dataForm: {
      type: Object as PropType<Record<string, string>>,
      default: () => {
        return {
          field1: '1',
          field2: '2'
        }
      }
    },
    formFields: {
      type: Array as PropType<ILgsFormItem[]>,
      default: () => {
        return [{
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
        }] as ILgsFormItem[]
      }
    }
  },
  components: { LgsForm }
})
</script>
<style scoped lang='scss'>

</style>
