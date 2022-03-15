<template>
  <DispatchCard>
    <template #header>
      <DispatchCardHeader title="水质监测" />
    </template>
    <DispatchInnerCard title="趋势曲线">
      <Lichart
        v-for="(item, i) in data"
        :key="i"
        :title="item.title"
        :color="item.color"
        :options="item.options"
      />
    </DispatchInnerCard>
  </DispatchCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { szjc_qsqx_data_linechart } from './index'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
import DispatchInnerCard from '../components/dispatchInnerCard.vue'
import Lichart from './lineChart.vue'
export default defineComponent({
  name: 'CardShuizhiJianCe',
  components: { DispatchCard, DispatchCardHeader, DispatchInnerCard, Lichart },
  setup() {
    const data = szjc_qsqx_data_linechart
    return {
      data
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 564px;
  height: 520px;
  background: url('~@/assets/dispatchCenterImages/水质监测背景框.png') no-repeat;
}
.sl-disptach-inner-card {
  width: 484px;
  height: 414px;
  background: url('~@/assets/dispatchCenterImages/水质监测内容背景.png') no-repeat;
}
.inner-card {
  margin: 10px;
}
</style>
