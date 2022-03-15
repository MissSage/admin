<template>
  <el-pagination
    :current-page="config.page || 1"
    :page-size="config.limit || 20"
    :class="config.align || 'left'"
    :layout="config.layout || 'total,sizes, prev, pager, next, jumper'"
    :total="config.total || 0"
    :page-sizes="config.pageSize || [5, 10, 20, 50, 100]"
    @size-change="(val:number)=>config.handleSize&&config.handleSize(val)"
    @current-change="(val:number)=>config.handlePage&&config.handlePage(val)"
    @prev-click="(val:number)=>config.handlePage&&config.handlePage(val)"
    @next-click="(val:number)=>config.handlePage&&config.handlePage(val)"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'
import { ISLPaginationConfig } from './type'

export default defineComponent({
  name: 'SLPagination',
  props: {
    config: {
      type: Object as PropType<ISLPaginationConfig>,
      default: () => {
        //
      }
    }
  },
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.left {
  text-align: left;
}
.right {
  text-align: right;
}
</style>
