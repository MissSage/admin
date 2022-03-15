<template>
  <div class="sl-dispatch-center-header">
    <div v-for="(item, i) in data" :key="i" class="sl-dispatch-center-header__item">
      <div class="sl-dispatch-center-header__item__top">
        <img class="sl-dispatch-center-header__item-icon" :src="item.icon" alt="" />
        <span class="sl-dispatch-center-header__item-label">{{ item.label }}</span>
      </div>
      <div class="sl-dispatch-center-header__item__bottom">
        <span class="sl-dispatch-center-header__item-count">{{ item.value }}</span>
        <span class="sl-dispatch-center-header__item-unit">{{ item.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { IDispatchNormalOption } from './index'
export default defineComponent({
  name: 'CenterHead',
  setup() {
    // codes here
    const state = reactive<{
      data: IDispatchNormalOption[]
    }>({
      data: [
        {
          icon: require('@/assets/dispatchCenterImages/设备.png'),
          label: '接入设备数',
          value: 21312,
          unit: '台'
        },
        {
          icon: require('@/assets/dispatchCenterImages/户数.png'),
          label: '用水户数',
          value: 15423,
          unit: '户'
        },
        {
          icon: require('@/assets/dispatchCenterImages/用水量.png'),
          label: '总用水量(近一月)',
          value: 42353,
          unit: 'm3'
        },
        {
          icon: require('@/assets/dispatchCenterImages/水费.png'),
          label: '总用水费用(近一月)',
          value: 54236,
          unit: '元'
        }
      ]
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-center-header {
  height: 144px;
  display: flex;
  justify-content: center;
  .sl-dispatch-center-header__item {
    height: 144px;
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .sl-dispatch-center-header__item__top {
      display: flex;
      align-content: center;
      justify-content: center;
      .sl-dispatch-center-header__item-icon {
        width: 28px;
        height: 28px;
      }
      .sl-dispatch-center-header__item-label {
        color: rgba(54, 159, 155, 1);
        font-size: 18px;
        font-family: PingFangSC-Medium;
        white-space: nowrap;
        line-height: 28px;
        margin-left: 13px;
      }
    }
    .sl-dispatch-center-header__item__bottom {
      .sl-dispatch-center-header__item-count {
        color: rgba(255, 255, 255, 1);
        font-size: 28px;
        font-family: PingFangSC-Medium;
        line-height: 40px;
        text-align: left;
      }
      .sl-dispatch-center-header__item-unit {
        color: rgba(54, 159, 155, 1);
        font-size: 16px;
        font-family: PingFangSC-Regular;
        line-height: 22px;
        margin: 13px 0 0 16px;
      }
    }
  }
}
</style>
