<template>
  <DispatchCard>
    <template #header>
      <DispatchCardHeader title="管网统计" />
    </template>
    <div class="card-container">
      <div class="card-left">
        <CardGwtjLeftTop :data="CardGwtjLeftTopData" />
        <DispatchInnerCard title="管网设施">
          <CardGwtjLeftBottom :data="GwssData" />
        </DispatchInnerCard>
      </div>
      <div class="card-right">
        <CardGwtjRightTop />
        <CardGwtjRightBottom />
      </div>
    </div>
  </DispatchCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
import DispatchInnerCard from '../components/dispatchInnerCard.vue'
import CardGwtjLeftTop from './cardGwtjLeftTop.vue'
import CardGwtjRightTop from './cardGwtjRightTop.vue'
import CardGwtjRightBottom from './cardGwtjRightBottom.vue'
import CardGwtjLeftBottom from './cardGwtjLeftBottom.vue'
import { IGwtjLeftTop } from './index'
import pic_ylyb from '@/assets/dispatchCenterImages/压力仪表.png'
import pic_ylyb1 from '@/assets/dispatchCenterImages/压力仪表(1).png'
import pic_ylyb2 from '@/assets/dispatchCenterImages/压力仪表(2).png'
import pic_ylyb3 from '@/assets/dispatchCenterImages/压力仪表(3).png'
import pic_ylyb4 from '@/assets/dispatchCenterImages/压力仪表(4).png'
import pic_ylyb5 from '@/assets/dispatchCenterImages/压力仪表(5).png'
export default defineComponent({
  name: 'CardGwtj',
  components: {
    DispatchCard,
    DispatchCardHeader,
    DispatchInnerCard,
    CardGwtjLeftTop,
    CardGwtjRightTop,
    CardGwtjRightBottom,
    CardGwtjLeftBottom
  },
  setup() {
    // codes here
    const CardGwtjLeftTopData: IGwtjLeftTop = {
      pipeTotal: 21312,
      pipeBridgeTotal: 233,
      sinkPipeTotal: 2222
    }
    const GwssData = [
      {
        icon: pic_ylyb,
        value: 200,
        label: '压力监测点数量',
        unit: '个'
      },
      {
        icon: pic_ylyb1,
        value: 30,
        label: '水质监测点数量',
        unit: '个'
      },
      {
        icon: pic_ylyb2,
        value: 70,
        label: '流量监测点数量',
        unit: '个'
      },
      {
        icon: pic_ylyb3,
        value: 15305,
        label: '居民抄表户数',
        unit: '户'
      },
      {
        icon: pic_ylyb4,
        value: 2000,
        label: '阀门点数量',
        unit: '个'
      },
      {
        icon: pic_ylyb5,
        value: 300,
        label: '泵站数量',
        unit: '个'
      }
    ]
    return {
      CardGwtjLeftTopData,
      GwssData
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 1141px;
  height: 520px;
  background: url('~@/assets/dispatchCenterImages/管网分析背景框.png') no-repeat;
  .card-container {
    display: flex;

    .card-left {
      display: flex;
      flex-direction: column;
    }
    .card-right {
      margin-top: -35px;
    }
  }
}
.sl-disptach-inner-card {
  width: 498px;
  height: 342px;
  background: url('~@/assets/dispatchCenterImages/管网设施内容背景.png');
  :deep(.sl-dispatch-inner-card__main) {
    overflow-y: auto;
    height: 300px;
  }
  .inner-card {
    margin: 10px;
  }
}
</style>
