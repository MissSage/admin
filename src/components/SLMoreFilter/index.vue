<template>
  <el-form
    :label-width="labelWidth || '80px'"
    :model="queryParams"
    class="more-filter"
    :inline="config.inline === false ? false : true"
  >
    <template v-for="filter in config.filters">
      <el-form-item
        v-if="!filter.hidden"
        :key="filter.field"
        :prop="filter.field"
        :label="filter.label"
      >
        <SLFormItem
          v-if="filter.field"
          v-model="queryParams[filter.field]"
          :config="filter"
        />
      </el-form-item>
    </template>
    <div class="footer">
      <el-button @click="$emit('close')">关 闭</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-form>
</template>

<script lang="ts">
import { ISLMoreFilter } from './type'
import { defineComponent, reactive, toRefs, PropType } from 'vue'
import SLFormItem from '../SLFormItem/index.vue'

export default defineComponent({
  name: 'SLMoreFilter',
  components: { SLFormItem },
  // 配置参数
  props: {
    config: {
      type: Object as PropType<ISLMoreFilter>,
      default: () => {
        //
      }
    },
    labelWidth: {
      type: [String, Number],
      default: '80px'
    },
    defaultParams: {
      type: Object as PropType<Record<string, any>>,
      default: () => {
        //
      }
    }
  },
  emits: ['submit', 'close'],
  setup (props, ctx) {
    const state = reactive<{
      queryParams: Record<string, any>
    }>({
      queryParams: {
        ...(props.defaultParams || {})
      }
    })
    const submit = () => {
      ctx.emit('submit', state.queryParams)
      ctx.emit('close')
    }
    return {
      ...toRefs(state),
      submit
    }
  }
})
</script>

<style lang="scss" scoped>
.more-filter {
  padding-top: 15px;
  overflow: hidden;
  position: absolute;
  background-color: #222536;
  box-shadow: 0px 5px 3px -3px rgb(31, 28, 28);
  z-index: 15;
  //  ;
  width: 100%;
  left: 0;
  top: calc(100% + 1px);
  .footer {
    text-align: right;
    padding: 20px;
  }
}
</style>
