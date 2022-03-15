<template>
  <div class="gwtj-gwss-container">
    <VueScroll :data="data" :class-option="optionHover" class="warp">
      <div v-for="(item, i) in data" :key="i" class="gwtj-gwss-item" :class-option="classOption">
        <div class="gwtj-gwss-item__icon">
          <img class="gwtj-gwss-item__icon__img" :src="item.icon" alt="" />
        </div>
        <span class="gwtt-gwss-item__label">{{ item.label }}</span>
        <div class="gwtt-gwss-item__right">
          <span class="gwtt-gwss-item__count">{{ item.value }}</span>
          <span class="gwtt-gwss-item__unit">{{ item.unit }}</span>
        </div>
      </div>
    </VueScroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import VueScroll from 'vue-seamless-scroll/src'
export default defineComponent({
  name: 'CardGwtjLeftBottom',
  components: { VueScroll },
  props: {
    data: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    }
  },
  setup() {
    // codes here
    const classOption = {
      step: 0.5
    }

    const optionHover = {
      step:0.4
    }
    return {
      classOption,
      optionHover
    }
  }
})
</script>

<style lang="scss" scoped>
.gwtj-gwss-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  font-family: PingFangSC-Regular, PingFang SC;
  .gwtj-gwss-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: center;
    height: 20px;
    margin: 14px 26px;
    .gwtj-gwss-item__icon {
      height: 25px;
      width: 25px;
      line-height: 20px;
      margin-right: 11px;
      text-align: center;
    }
    .gwtt-gwss-item__label {
      flex: 1;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
    }
    .gwtt-gwss-item__right {
      .gwtt-gwss-item__count {
        height: 20px;
        font-size: 16px;
        font-weight: 500;
        color: #53ecff;
        line-height: 20px;
        margin-right: 8px;
      }
      .gwtt-gwss-item__unit {
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        color: #32929e;
        line-height: 17px;
      }
    }
  }
}
.warp {
  height: 300px;
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
      justify-content: space-between;
      font-size: 15px;
    }
  }
}
</style>
