<template>
  <el-form-item :label="config.label || '选择时间'">
    <div style="display: flex">
      <el-radio-group
        v-model="defaultValue"
        style="height: 48px; display: flex; align-items: center"
        @change="optionChange"
      >
        <el-radio
          v-for="(item, i) in config.options"
          :key="i"
          style="margin-bottom: 0"
          :label="item.value"
          >{{ item.label }}</el-radio
        >
        <el-radio v-if="config.showOther" style="margin-bottom: 0" label="other"
          >自定义时间</el-radio
        >
      </el-radio-group>
      <el-date-picker
        v-if="datePickerVisible"
        v-model="daterange"
        type="datetimerange"
        style="margin-left: 16px; height: 48px"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="daterangeChange"
      >
      </el-date-picker>
    </div>
  </el-form-item>
</template>

<script>
import moment from 'moment'
export default {
  props: ['config'],
  data() {
    return {
      defaultValue: 1,
      daterange: [moment().subtract(1, 'months'), moment()],
      datePickerVisible: false
    }
  },
  mounted() {
    this.$emit('checkVal', this.daterange, this.config.key)
  },
  methods: {
    optionChange(val) {
      if (val === 'other') {
        this.datePickerVisible = true
      } else {
        const option = this.config.options.find(item => item.value == val)
        if (!option) return
        const intval = parseInt(val)
        this.datePickerVisible = false
        this.daterange = [moment().subtract(intval, option.unit), moment()]
      }
      this.$emit('checkVal', this.daterange, this.config.key)
    },
    daterangeChange(val) {
      this.$emit('checkVal', val, this.config.key)
    }
  }
}
</script>

<style lang="scss" scoped></style>
