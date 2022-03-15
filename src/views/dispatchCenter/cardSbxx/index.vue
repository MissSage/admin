<template>
  <DispatchCard>
    <template #header> <DispatchCardHeader title="水表信息" /> </template>
    <div class="dispatch-sbxx-top">
      <ColorCircle
        :label="'总水表数量'"
        :value="24234"
        :background-color="'#8FEEFD'"
        :border-color="'#49D0F2'"
      />
      <ColorCircle
        :label="'正常水表数'"
        :value="23596"
        :background-color="'#FDFEC6'"
        :border-color="'#F4BA45'"
      />
      <ColorCircle
        :label="'销户水表数'"
        :value="425"
        :background-color="'#FCE7ED'"
        :border-color="'#F46263'"
      />
      <ColorCircle
        :label="'拆停水表数'"
        :value="153"
        :background-color="'#EBDCFF'"
        :border-color="'#885AF4'"
      />
    </div>
    <DispatchInnerCard title="区域统计">
      <VueScroll :data="tjList" :class-option="optionHover" class="warp">
        <ul>
          <li v-for="(item, i) in tjList" :key="i">
            <ProgressItem :data="item" />
          </li>
        </ul>
      </VueScroll>
    </DispatchInnerCard>
  </DispatchCard>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
import DispatchInnerCard from '../components/dispatchInnerCard.vue'
import ColorCircle from './colorCircle.vue'
import ProgressItem from '../components/ProgressItem.vue'
import VueScroll from 'vue-seamless-scroll/src'
export default defineComponent({
  name: 'CardSbxx',
  components: {
    DispatchCard,
    DispatchCardHeader,
    DispatchInnerCard,
    ColorCircle,
    ProgressItem,
    VueScroll
  },
  setup() {
    const state = reactive<{
      total: number
      normal: number
      closed: number
      knocked: number
      optionHover: any
      tjList: any[]
    }>({
      total: 24234,
      normal: 23596,
      closed: 425,
      knocked: 153,
      optionHover: {
        step: 0.4
      },
      tjList: []
    })
    const getPressItem = (value, percentage, label) => {
      return {
        label,
        percentage,
        count: value,
        unit: '个'
      }
    }
    const initProgress = () => {
      let length = 12
      const countList: number[] = []
      for (let i = 1; i <= length; i++) {
        const count = parseInt((Math.random() * 4000).toFixed(0))
        countList.push(count)
        state.total += count
      }
      state.normal = parseInt((state.total*0.9).toFixed(0))
      state.closed = parseInt((state.total*0.06).toFixed(0))
      state.knocked = parseInt((state.total*0.04).toFixed(0))
      const Max = Math.max(...countList)
      countList.map((item, i) => {
        state.tjList.push(
          getPressItem(
            item,
            item / Max *100,
            '区域' + i
          )
        )
      })
    }
    onMounted(() => {
      initProgress()
    })
    return {
      ...toRefs(state),
      initProgress,
      getPressItem
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 564px;
  height: 600px;
  background: url('~@/assets/dispatchCenterImages/监测点／用水／水表背景框.png');
}
.dispatch-sbxx-top {
  display: flex;
  justify-content: space-around;
  align-content: center;
  margin: 0 40px;
}
.sl-disptach-inner-card {
  width: 484px;
  height: 379px;
  margin: 0 40px;
  background: url('~@/assets/dispatchCenterImages/区域统计内容背景.png') no-repeat;
}
:deep(.el-progress-bar__inner) {
  background-color: unset;
  background-image: linear-gradient(to right, #4ddaf1, #4df1ab);
}
.warp {
  height: 340px;
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
      margin: 20px 10px;
      justify-content: space-between;
      font-size: 15px;
    }
  }
}
</style>
