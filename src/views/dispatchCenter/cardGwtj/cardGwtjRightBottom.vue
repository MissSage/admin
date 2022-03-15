<template>
  <div class="gwtj-right-bottom">
    <DispatchDescribeHeader title="日均管网压力" />
    <VChart class="gwtj-chart" :option="xfoptions"></VChart>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { initOption } from './index'
import DispatchDescribeHeader from '../components/dispatchDescribeHeader.vue'
export default defineComponent({
  name: 'CardGwtjRightBottom',
  components: {
    DispatchDescribeHeader
  },
  setup() {
    // codes here
    const xfoptions = initOption()
    return{
      xfoptions
    }
  }
})
</script>

<style lang="scss" scoped>
.gwtj-right-bottom {
  margin: 15px 0;
  height: 250px;
}
.gwtj-chart{
  width:570px;
  height:250px
}
.dispatch-describe-header{
  margin-right: 44px;
}
</style>
