<template>
  <DispatchCard>
    <template #header><DispatchCardHeader title="漏损排行榜" /> </template>
    <div class="lsphb-chart-box">
      <VueScroll :data="phbList" :class-option="optionHover" class="wrap">
        <ul>
          <li v-for="(item, i) in phbList" :key="i">
            <ProgressItem :data="item" />
          </li>
        </ul>
      </VueScroll>
    </div>
  </DispatchCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DispatchCard from './components/dispatchCard.vue'
import DispatchCardHeader from './components/dispatchCardHeader.vue'
import ProgressItem from './components/ProgressItem.vue'
import VueScroll from 'vue-seamless-scroll/src'
export default defineComponent({
  name: 'CardLxphb',
  components: { DispatchCard, DispatchCardHeader, ProgressItem, VueScroll },
  setup() {
    // codes here
    const phbList = [
      {
        label: '1.区域1',
        percentage: 79,
        count: 79,
        unit: '%'
      },
      {
        label: '2.区域2',
        percentage: 70,
        count: 70,
        unit: '%'
      },
      {
        label: '3.区域3',
        percentage: 62,
        count: 62,
        unit: '%'
      },
      {
        label: '4.区域4',
        percentage: 52,
        count: 52,
        unit: '%'
      },
      {
        label: '5.区域5',
        percentage: 43,
        count: 43,
        unit: '%'
      },
      {
        label: '6.区域6',
        percentage: 37,
        count: 37,
        unit: '%'
      },
      {
        label: '7.区域7',
        percentage: 31,
        count: 31,
        unit: '%'
      },
      {
        label: '8.区域8',
        percentage: 25,
        count: 25,
        unit: '%'
      },
      {
        label: '9.区域9',
        percentage: 20,
        count: 20,
        unit: '%'
      },
      {
        label: '10.区域10',
        percentage: 19,
        count: 19,
        unit: '%'
      },
      {
        label: '11.区域11',
        percentage: 14,
        count: 14,
        unit: '%'
      },
      {
        label: '12.区域12',
        percentage: 12,
        count: 12,
        unit: '%'
      }
    ]
    const optionHover = {
      step: 0.4
    }
    return {
      phbList,
      optionHover
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

:deep(.el-progress-bar__inner) {
  background-color: unset;
  background-image: linear-gradient(to right, #f1764d, #b52e2e);
}
:deep(.dispatch-progress .dispatch-progress__info .dispatch-progress__info__count) {
  color: #ef734c;
}
:deep(.dispatch-progress .dispatch-progress__info .dispatch-progress__info__unit) {
  color: #ef734c;
}
.wrap {
  height: 270px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    li,
    a {
      display: block;
      height: 30px;
      line-height: 30px;
      display: flex;
      margin: 20px 40px;
      justify-content: space-between;
      font-size: 15px;
    }
  }
}
</style>
