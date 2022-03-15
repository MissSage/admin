<template>
  <SLCard class="card-box" :title="config.title">
    <template #query>
      <div class="query-wrapper">
        <div
          v-for="(item, i) in config.headerQuery"
          :key="i"
          class="query-item"
        >
          <label class="query-label" :for="item.field">{{ item.label }}</label>
          <SLFormItem
            v-if="item.type !== 'table'"
            v-model="queryParams[item.field]"
            :config="item"
            @change="()=>handleChange()"
          ></SLFormItem>
        </div>
      </div>
    </template>
    <template #right>
      <div class="btn-wrapper">
        <template v-for="(btn, i) in config.headerBtns || []" :key="i">
          <SLButton :config="btn"></SLButton>
        </template>
      </div>
    </template>
    <SLTable :config="config"></SLTable>
  </SLCard>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import SLCard from '@/components/SLCard/index.vue'
import { ISLCardTable } from './type'
import SLButton from '../SLButton/index.vue'
import SLTable from '../SLTable/index.vue'
import SLFormItem from '../SLFormItem/index.vue'

export default defineComponent({
  name: 'SLCardTable',
  components: { SLCard, SLButton, SLTable, SLFormItem },
  props: {
    config: {
      type: Object as PropType<ISLCardTable>,
      default: () => {
        //
      }
    }
  },
  emits: ['change'],
  setup (props, ctx) {
    const queryParams = ref<any>({
      ...(props.config.headerQueryDefault || {})
    })
    const handleChange = () => {
      props.config.handleQuery && props.config.handleQuery(queryParams)
      ctx.emit('change', queryParams)
    }
    return {
      queryParams,
      handleChange
    }
  }
})
</script>
<style scoped lang="scss">
.card-box{
  height: 100%;
  width: 100%;
}
.btn-wrapper,
.query-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  margin-left: 8px;
}
.query-item {
  flex-basis: 25%;
  min-width: 350px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  .query-label{
    word-break: keep-all;
    margin-right: 8px;
    line-height: 36px;
    font-weight: 500;
    font-size: 14px;
  }
}
:deep(.el-button){
  min-height: 36px;
  line-height: 34px;
  padding: 0 12px;
}
</style>
