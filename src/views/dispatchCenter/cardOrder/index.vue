<template>
  <DispatchCard>
    <template #header> <DispatchCardHeader title="工单分析" /> </template>
    <div class="dispatch-order__top">
      <OrderHeaderItem :label="'工单总数'" :value="6325" :color="'#53ECFF'" />
      <OrderHeaderItem :label="'待办工单数'" :value="164" :color="'#54FF53'" />
      <OrderHeaderItem :label="'超时工单数'" :value="76" :color="'#FF5353'" />
    </div>
    <div class="dispatch-order__bottom">
      <VChart class="order-chart" :option="xfoptions"></VChart>
    </div>
  </DispatchCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { initOption } from './index'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
import OrderHeaderItem from './headerItem.vue'
export default defineComponent({
  name: 'CardOrder',
  components: { DispatchCard, DispatchCardHeader, OrderHeaderItem },
  setup() {
    // codes here
    const xfoptions = initOption()
    return {
      xfoptions
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 564px;
  height: 368px;
  background: url('~@/assets/dispatchCenterImages/漏损率／排行／报警／工单背景框.png') no-repeat;
}
.dispatch-order__top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  margin: 0 40px;
}
.dispatch-order__bottom{
  margin: 0;
  height: 250px;
}
</style>
