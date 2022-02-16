<template>
  <label v-if="config.type === 'text'" class="readonly-input">
    {{ modelValue }}
  </label>

  <el-input
    v-else-if="config.type === 'input'"
    v-show="!config.hidden"
    v-model="value"
    size="medium"
    clearable
    :placeholder="config.placeholder||'请输入'"
    :disabled="config.readonly || config.disabled"
    @change="config.onChange"
    @keyup.enter="config.onKeyUp"
  />
  <el-input
    v-else-if="config.type === 'password'"
    v-show="!config.hidden"
    v-model="value"
    type="password"
    size="medium"
    clearable
    :disabled="config.readonly || config.disabled"
    :placeholder="config.placeholder||'请输入'"
  />
  <el-input
    v-else-if="config.type === 'textarea'"
    v-model="value"
    type="textarea"
    clearable
    :ref="config.field"
    :disabled="config.readonly || config.disabled"
    :autosize="{
      minRows: config.minRow || 2,
      maxRows: config.maxRow || 10,
    }"
    :placeholder="config.placeholder||'请输入'"
  />
  <el-input-number
    v-else-if="config.type === 'number'"
    v-model="value"
    style="width: 100%"
    :min="config.min"
    :max="config.max"
    :controls-position="config.controlPosition"
  />
  <el-select
    v-else-if="config.type==='select'"
    v-show="!config.hidden"
    size="medium"
    style="width: 100%"
    v-model="value"
    filterable
    clearable
    :allow-create="config.allowCreate"
    :disabled="config.readonly || config.disabled"
    :multiple="config.multiple"
    :placeholder="config.placeholder||'请选择'"
    :remote="config.remote"
    :remote-method="(val:any) => { remoteSearch(val); }"
    @change="handleChange"
  >
    <el-option
      v-for="(obj,i) in config.options"
      :key="i"
      :label="obj.label"
      :value="obj.value"
    />
  </el-select>
  <el-cascader
    v-else-if="config.type === 'cascader'"
    clearable
    size="medium"
    style="width: 100%"
    v-model="value"
    :disabled="config.readonly || config.disabled"
    :options="config.options"
    :props="{
      checkStrictly: config.checkStrictly,
    }"
    @change="config.onChange"
  />
  <el-switch
    v-else-if="config.type === 'switch'"
    v-show="!config.hidden"
    v-model="value"
    :disabled="config.readonly || config.disabled"
    active-color="#0f84ff"
    inactive-color="rgb(194 194 194)"
    @change="config.onChange"
  />
  <el-radio-group
    v-else-if="config.type === 'radio'"
    v-show="!config.hidden"
    v-model="value"
    :disabled="config.readonly || config.disabled"
    @change="config.onChange"
  >
    <el-radio
      v-for="(kv,i) in config.options"
      :key="i"
      :label="kv.value"
    >
      {{ kv.label }}
    </el-radio>
  </el-radio-group>

  <el-checkbox-group
    :disabled="config.readonly || config.disabled"
    v-show="!config.hidden"
    v-model="value"
    v-else-if="config.type === 'checkbox'"
    @change="config.onChange"
  >
    <el-checkbox
      v-for="(kv, i) in config.options"
      :key="i"
      :label="kv.value"
    >
      {{ kv.label }}
    </el-checkbox>
  </el-checkbox-group>
  <el-date-picker
    v-else-if="config.type==='date'||config.type==='datetime'"
    clearable
    :disabled="config.readonly || config.disabled"
    style="width: 100%"
    size="medium"
    v-model="value"
    @change="config.onChange"
    :type="config.type"
    :placeholder="config.placeholder||'请选择'"
    :disabled-date="(val:any) => getDateOptions(val)"
    :value-format="config.type==='date'?'YYYY-MM-DD':'YYYY-MM-DD HH:mm:ss'"
  />
  <el-date-picker
    v-else-if="config.type==='daterange'||config.type==='datetimerange'"
    v-model="value"
    style="width: 100%"
    size="medium"
    clearable
    :type="config.type"
    :range-separator="config.rangeSeparator||'到'"
    :disabled="config.readonly || config.disabled"
    :placeholder="config.placeholder||'请选择'"
    :disabled-date="(val:any) => getDateOptions(val)"
    :value-format="config.type==='daterange'?'YYYY-MM-DD':'YYYY-MM-DD HH:mm:ss'"
    @change="config.onChange"
  />
  <el-time-picker
    v-else-if="config.type === 'time'"
    v-model="value"
    placeholder="请选择时间"
    :format="config.format"
    :is-range="config.isRange"
    style="width: 100%"
    size="medium"
  />

  <lgs-editor
    v-else-if="config.type === 'editor'"
    ref="editor"
    v-model="value"
  />
</template>
<script lang='ts'>
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue'
import { ILgsFormDate, ILgsFormDateRange, ILgsFormItem } from '@/components/LgsFormItem/type'
import { ElOption, ElCheckboxGroup, ElRadioGroup, ElRadio, ElCascader, ElDatePicker, ElTimePicker, ElCheckbox, ElFormItem, ElInput, ElInputNumber, ElSelect, ElSwitch } from 'element-plus'
import LgsEditor from '../LgsEditor/LgsEditor.vue'

export default defineComponent({
  name: 'LgsFormItem',
  emits: ['update:model-value', 'change'],
  components: {
    LgsEditor,
    ElSelect,
    ElInput,
    ElInputNumber,
    ElSwitch,
    ElCheckbox,
    ElDatePicker,
    ElTimePicker,
    ElRadio,
    ElCascader,
    ElCheckboxGroup,
    ElRadioGroup,
    ElOption
  },
  props: {
    modelValue: {
      type: [String, Number, Boolean, Array, Object],
      default: ''
    },
    config: {
      type: Object as PropType<ILgsFormItem>,
      default: () => {

      }
    }
  },
  setup (props, ctx) {
    const formatModelValue = (value:String|Number|Boolean|Array<any>|Object) => {
      switch (props.config.type) {
        case 'cascader':
        case 'checkbox':
        case 'daterange':
        case 'datetimerange':
        case 'table':
          return value instanceof Array ? value : []
        case 'date':
        case 'datetime':
        case 'editor':
        case 'input':
        case 'password':
        case 'radio':
        case 'switch':
        case 'text':
        case 'textarea':
        case 'time':
        case 'uploader':
          return typeof value === 'string' ? value : value.toString()

        case 'select':
          return props.config.multiple ? value instanceof Array ? value : [] : value.toString()
        case 'number':
          return typeof value === 'number' ? value : value ? parseFloat(value.toString()) : 0
        default:
          return value
      }
    }
    const state = reactive<{
      value:any
      }>({
        value: formatModelValue(props.modelValue)
      })

    const handleChange = (val:any) => {
      console.log(val)

      props.config.onChange && props.config.onChange(val)
      ctx.emit('update:model-value', val)
      ctx.emit('change', val)
    }
    // 远程搜索(打开弹出框时应该禁止搜索)
    const remoteSearch = async (val:any) => {
      if (props.config.type === 'select') {
        const res = props.config.remoteMethod && await props.config.remoteMethod(val)
        if (res) {
          props.config.options = res
        }
      }
      // if (
      //   val === '' ||
      //   (item.data.length === 1 &&
      //     (val === item.data[0].key || val === item.data[0].value))
      // ) {
      //   return
      // }
      // 弹出框或初始化表单时给data设置数组默认值2
      // 2020.09.26修复远程搜索自定义url不起作用的问题
      // let url
      // if (typeof item.url === 'function') {
      //   url = item.url(val, item.dataKey, item)
      // } else {
      //   url =
      //     (item.url || '/api/Sys_Dictionary/GetSearchDictionary') +
      //     '?dicNo=' +
      //     item.dataKey +
      //     '&value=' +
      //     val
      // }
      // this.http.post(url).then((dicData) => {
      //   // this.$set(item, "loading", false);
      //   item.loading = false
      //   item.data = dicData
      //   this.formRules[item.point.x].splice(item.point.y, 1, item)
      // })
    }
    const getDateOptions = (date:any) => {
      const item = props.config as ILgsFormDate | ILgsFormDateRange
      // 2021.07.17设置时间可选范围
      if ((!item.min && !item.max) || !date) {
        return false
      }
      if (item.min && item.min.indexOf(' ') === -1) {
        // 不设置时分秒，后面会自动加上 08:00
        item.min = item.min + ' 00:00:000'
      }
      return (
        compareDate(date, item.min) || !compareDate(date, item.max)
      )
    }
    const compareDate = (date1:any, date2:any) => {
      if (!date2) {
        return true
      }
      return (
        date1.valueOf() <
        (typeof date2 === 'number' ? date2 : new Date(date2).valueOf())
      )
    }
    watch(
      () => state.value,
      (val:string) => {
        ctx.emit('update:model-value', val)
      }, {

      })
    return {
      ...toRefs(state),
      remoteSearch,
      getDateOptions,
      handleChange
    }
  }
})
</script>
<style scoped lang='scss'>
</style>
