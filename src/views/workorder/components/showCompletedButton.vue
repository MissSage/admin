<template>
  <div class="card-search-checkbox">
    <el-checkbox v-model="value" @change="handleChange">{{ operation.label }}</el-checkbox>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  name: 'ShowCompletedButton',
  props: {
    operation: {
      type: Object as PropType<NormalOperation>,
      default: () => {
        //
      }
    }
  },
  setup(props, ctx) {
    const value = ref<boolean>(false)
    const handleChange = (val:boolean)=>{
      props.operation.key && ctx.emit('checkVal', val, props.operation.key)
    }
    return {
      value,
      handleChange
    }
  }
})
</script>

<style lang='scss' scoped>
.card-search-checkbox {
  height: 48px;
  display: inline;
  margin: 0 10px;
  .el-checkbox{
    line-height: 48px;
  }
}
</style>