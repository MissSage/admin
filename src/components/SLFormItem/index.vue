<template>
  <label v-if="config.type === 'text'" class="readonly-input">
    {{ (config.formatter ? config.formatter(modelValue) : modelValue) || '-' }}
    {{ config.unit ? config.unit : '' }}
  </label>

  <el-input
    v-else-if="config.type === 'input'"
    v-show="!config.hidden"
    v-model="value"

    clearable
    :placeholder="config.placeholder || '请输入'"
    :disabled="config.readonly || config.disabled"
    @change="handleChange"
    @keyup.enter="config.onKeyUp"
  />
  <el-input
    v-if="config.type === 'input-number'"
    v-model="value"
    :disabled="config.disabled"
    :placeholder="config.placeholder || '请输入'"
    onkeyup="value=value.replace(/[^\d]/g,'')"
    @change="handleChange"
  >
    <template #suffix>
      <i v-if="config.unit" class="unit input-number-unit">{{ config.unit }}</i>
    </template>
  </el-input>
  <el-input
    v-else-if="config.type === 'password'"
    v-show="!config.hidden"
    v-model="value"
    type="password"
    clearable
    :disabled="config.readonly || config.disabled"
    :placeholder="config.placeholder || '请输入'"
    @change="handleChange"
  />
  <el-input
    v-else-if="config.type === 'textarea'"
    v-show="!config.hidden"
    :ref="config.field"
    v-model="value"
    type="textarea"
    clearable
    :disabled="config.readonly || config.disabled"
    :autosize="{
      minRows: config.minRow || 2,
      maxRows: config.maxRow || 10
    }"
    :placeholder="config.placeholder || '请输入'"
    @change="handleChange"
  />
  <el-input-number
    v-else-if="config.type === 'number'"
    v-show="!config.hidden"
    v-model="value"

    style="width: 100%"
    :min="config.min"
    :max="config.max"
    :disabled="config.readonly || config.disabled"
    :controls-position="config.controlPosition"
    @change="handleChange"
  />
  <el-select
    v-else-if="config.type === 'select'"
    v-show="!config.hidden"
    v-model="value"

    style="width: 100%"
    filterable
    collapse-tags
    clearable
    :allow-create="config.allowCreate"
    :disabled="config.readonly || config.disabled"
    :multiple="config.multiple"
    :placeholder="config.placeholder || '请选择'"
    @change="handleChange"
  >
    <el-option
      v-for="(obj, i) in config.options"
      :key="i"
      :label="obj.label"
      :value="obj.value"
    />
  </el-select>
  <el-cascader
    v-else-if="config.type === 'cascader'"
    v-show="!config.hidden"
    v-model="value"
    clearable

    style="width: 100%"
    :disabled="config.readonly || config.disabled"
    :options="config.options"
    :props="
      config.props || {
        checkStrictly: true
      }
    "
    @change="handleChange"
  />
  <el-switch
    v-else-if="config.type === 'switch'"
    v-show="!config.hidden"
    v-model="value"
    inline-prompt

    :disabled="config.readonly || config.disabled"
    :active-color="config.activeColor || '#1DCF8E'"
    :inactive-color="config.inActiveColor || '#3A3E56'"
    :active-text="config.activeText || '是'"
    :inactive-text="config.inActiveText || '否'"
    :active-value="config.activeValue || true"
    :inactive-value="config.inActiveValue || false"
    @change="handleChange"
  />
  <el-radio-group
    v-else-if="config.type === 'radio'"
    v-show="!config.hidden"
    v-model="value"

    :disabled="config.readonly || config.disabled"
    @change="handleChange"
  >
    <el-radio
      v-for="(kv, i) in config.options"
      :key="i"
      :label="kv.value"
    >
      {{ kv.label }}
    </el-radio>
  </el-radio-group>

  <el-checkbox-group
    v-else-if="config.type === 'checkbox'"
    v-show="!config.hidden"
    v-model="value"

    :disabled="config.readonly || config.disabled"
    @change="handleChange"
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
    v-else-if="config.type === 'month'"
    v-model="value"
    clearable
    :disabled="config.readonly || config.disabled"
    style="width: 100%"

    :type="config.type"
    :placeholder="config.placeholder || '请选择'"
    :disabled-date="(val:any) => getDateOptions(val)"
    :format="config.textFormat || 'YYYY-MM'"
    :value-format="config.format || 'YYYY-MM'"
    @change="handleChange"
  />
  <el-date-picker
    v-else-if="config.type === 'date' || config.type === 'datetime'"
    v-model="value"
    clearable
    :disabled="config.readonly || config.disabled"
    style="width: 100%"

    :type="config.type"
    :placeholder="config.placeholder || '请选择'"
    :disabled-date="(val:any) => getDateOptions(val)"
    :format="config.textFormat || (config.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss')"
    :value-format="config.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
    @change="handleChange"
  />
  <el-date-picker
    v-else-if="config.type === 'daterange' || config.type === 'datetimerange'"
    v-model="value"
    style="width: 100%"

    clearable
    :type="config.type"
    :range-separator="config.rangeSeparator || '到'"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :disabled="config.readonly || config.disabled"
    :placeholder="config.placeholder || '请选择'"
    :disabled-date="(val:any) => getDateOptions(val)"
    :value-format="config.type === 'daterange' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
    @change="handleChange"
  />
  <el-time-picker
    v-else-if="config.type === 'time'"
    v-model="value"
    placeholder="请选择时间"
    :format="config.format"
    :is-range="config.isRange"
    :disabled="config.readonly || config.disabled"
    style="width: 100%"

    @change="handleChange"
  />

  <ChooseUserByRole
    v-else-if="config.type === 'user'"
    width="100%"
    :multiple="config.multiple"
    :height="config.height || '40px'"
    @check-users="(users:any) => handleChange(users)"
  />
  <SLUploader
    v-if="config.type === 'image'"
    v-model="value"
    :limit="config.limit"
    :disabled="config.readonly || config.disabled"
    :url="config.url || imgActionUrl"
    :multiple="config.multiple"
    :return-type="config.returnType"
  >
  </SLUploader>
  <SLFileUploader
    v-if="config.type === 'file'"
    v-model="value"
    :limit="config.limit"
    :disabled="config.readonly || config.disabled"
    :url="config.url || fileActionUrl"
    :multiple="config.multiple"
    :return-type="config.returnType"
  ></SLFileUploader>
  <SLAmap
    v-if="config.type === 'amap'"
    v-show="!config.hidden"
    v-model="value"
    :disabled="config.readonly || config.disabled"
    :required="config.required"
    :result-type="config.resultType"
  ></SLAmap>
</template>

<script lang="ts">
import SLUploader from '@/components/SLUploader/index.vue'
import SLAmap from '@/components/SLAmap/index.vue'
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue'
import { ISLFormDate, ISLFormDateRange, ISLFormItem } from './type'
import { useStore } from 'vuex'
import { deresolveValue, resolveValue } from './isValid'
import ChooseUserByRole from '@/components/chooseUserByRole/index.vue'
import SLFileUploader from '../SLFileUploader/index.vue'
export default defineComponent({
  name: 'SLFormItem',
  components: { SLAmap, SLUploader, ChooseUserByRole, SLFileUploader },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    modelValue: [String, Number, Array, Object, Boolean],
    config: {
      type: Object as PropType<ISLFormItem>,
      default: () => {
        //
      }
    }
  },
  emits: ['update:model-value', 'change'],
  setup (props, ctx) {
    const store = useStore()
    const state = reactive<{
      value: any
      imgActionUrl: string
      fileActionUrl: string
    }>({
      value: resolveValue(props.config, props.modelValue),
      imgActionUrl: store.state.app.actionUrl + 'file/api/upload/image',
      fileActionUrl: store.state.app.actionUrl + 'file/api/upload/file'
    })

    const handleChange = (val: any) => {
      ctx.emit('update:model-value', deresolveValue(props.config, val))
      ctx.emit('change', val)
      props.config.onChange && props.config.onChange(val)
    }

    const getDateOptions = (date: any) => {
      const item = props.config as ISLFormDate | ISLFormDateRange
      // 2021.07.17设置时间可选范围
      if ((!item.min && !item.max) || !date) {
        return false
      }
      if (item.min && item.min.indexOf(' ') === -1) {
        // 不设置时分秒，后面会自动加上 08:00
        item.min = item.min + ' 00:00:000'
      }
      return compareDate(date, item.min) || !compareDate(date, item.max)
    }
    const compareDate = (date1: any, date2: any) => {
      if (!date2) {
        return true
      }
      return date1.valueOf() < (typeof date2 === 'number' ? date2 : new Date(date2).valueOf())
    }
    watch(
      () => state.value,
      (val: string) => {
        ctx.emit('update:model-value', val)
      },
      {
        deep: true
      }
    )
    watch(
      () => props.modelValue,
      val => {
        state.value = resolveValue(props.config, val)
      },
      {
        immediate: true
      }
    )
    return {
      ...toRefs(state),
      getDateOptions,
      handleChange
    }
  }
})
</script>

<style lang="scss" scoped>
.readonly-input {
  line-height: 36px;
  color: #ffffff;
}
.unit {
  font-style: normal;
  font-size: 14px;
  margin-right: 10px;
}
</style>
