<template>
  <div class="gwtj-left-header">
    <div class="gwtj-left-header__item">
      <div class="gwtj-left-header__item-top">
        <img
          class="gwtj-left-header__item-top__icon"
          src="~@/assets/dispatchCenterImages/设备(1).png"
          alt=""
        />
        <span class="gwtj-left-header__item-top__label">管网总长度</span>
      </div>
      <div class="gwtj-left-header__item-bottom">
        <span class="gwtj-left-header__item-bottom__number">{{ data.pipeTotal }}</span>
        <span class="gwtj-left-header__item-bottom__unit">km</span>
      </div>
    </div>
    <div class="gwtj-left-header__item">
      <div class="gwtj-left-header__item-top">
        <img
          class="gwtj-left-header__item-top__icon"
          src="~@/assets/dispatchCenterImages/设备(2).png"
          alt=""
        />
        <span class="gwtj-left-header__item-top__label">桥管总数</span>
      </div>
      <div class="gwtj-left-header__item-bottom">
        <span class="gwtj-left-header__item-bottom__number">{{ data.pipeBridgeTotal }}</span>
        <span class="gwtj-left-header__item-bottom__unit">座</span>
      </div>
    </div>
    <div class="gwtj-left-header__item">
      <div class="gwtj-left-header__item-top">
        <img
          class="gwtj-left-header__item-top__icon"
          src="~@/assets/dispatchCenterImages/设备(3).png"
          alt=""
        />
        <span class="gwtj-left-header__item-top__label">沉管总数</span>
      </div>
      <div class="gwtj-left-header__item-bottom">
        <span class="gwtj-left-header__item-bottom__number">{{ data.sinkPipeTotal }}</span>
        <span class="gwtj-left-header__item-bottom__unit">座</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IGwtjLeftTop } from './index'
export default defineComponent({
  name: 'CardGwtjLeftTop',
  props: {
    data: {
      type: Object as PropType<IGwtjLeftTop>,
      default: () => {
        return {
          pipeTotal: 0,
          pipeBridgeTotal: 0,
          sinkPipeTotal: 0
        }
      }
    }
  },
  setup() {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
.gwtj-left-header {
  display: flex;
  justify-content: center;
  align-content: center;
  width: 498px;
  margin: 8px 40px 8px 40px;
  .gwtj-left-header__item {
    display: flex;
    width: 160px;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    .gwtj-left-header__item-top {
      display: flex;
      justify-content: center;
      align-content: center;
      margin-bottom: 8px;
      .gwtj-left-header__item-top__icon {
        width: 16px;
        height: 16px;
        line-height: 20px;
        margin: 2px;
      }
      .gwtj-left-header__item-top__label {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #718092;
        line-height: 20px;
        margin-left: 4px;
      }
    }
    .gwtj-left-header__item-bottom {
      text-align: center;
      .gwtj-left-header__item-bottom__number {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #53ecff;
        line-height: 28px;
        margin-right: 8px;
      }
      .gwtj-left-header__item-bottom__unit {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #53ecff;
        line-height: 20px;
      }
    }
  }
}
</style>
