<template>
  <div class="gwtj-right-top">
    <div class="gwtj-right-top-item">
      <DispatchDescribeHeader title="管网材质" />
      <PieChart :data="data1" />
    </div>
    <div class="gwtj-right-top-item">
      <DispatchDescribeHeader title="管龄" />
      <PieChart :data="data2" />
    </div>
    <div class="gwtj-right-top-item">
      <DispatchDescribeHeader title="管道口径" />
      <PieChart :data="data3" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DispatchDescribeHeader from '../components/dispatchDescribeHeader.vue'
import PieChart from './pieChart.vue'
export default defineComponent({
  name: 'CardGwtjRightTop',
  components: {
    DispatchDescribeHeader,
    PieChart
  },
  setup() {
    // codes here
    const data1 = [
      { value: 30, name: 'PE管' },
      { value: 20, name: '不锈钢管' },
      { value: 40, name: '其它管' },
      { value: 10, name: '铁管' }
    ]
    const data2 = [
      { value: 10, name: '10年以上' },
      { value: 40, name: '3-5年' },
      { value: 20, name: '5-10年' },
      { value: 30, name: '1-2年' }
    ]
    const data3 = [
      { value: 30, name: '1000<DN' },
      { value: 20, name: '500<DN<1000' },
      { value: 40, name: 'DN<300' },
      { value: 10, name: '300<DN<500' }
    ]
    return {
      data1,
      data2,
      data3
    }
  }
})
</script>

<style lang="scss" scoped>
.gwtj-right-top {
  display: flex;
  height: 160px;
  justify-content: space-between;
  align-content: center;
  .gwtj-right-top-item {
    width: 175px;
    display: flex;
    flex-direction: column;
  }
}
</style>
