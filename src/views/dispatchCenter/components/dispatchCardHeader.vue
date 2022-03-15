<template>
  <div class="dispatch-header-container">
    <div class="dispatch-header">
      <div class="dispatch-header__icon"></div>
      <div class="dispatch-header__label">
        <span>{{ title }}</span>
      </div>
    </div>
    <div class="dispatch-header__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DispatchCardHeader',
  props: {
    title: {
      type: String,
      default: '统计分析'
    }
  },
  setup() {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
.dispatch-header-container {
  position: relative;
  width: 100%;
  .dispatch-header {
    margin: 32px 0 16px 26px;
    width: 191px;
    height: 24px;
    background: rgba(14, 56, 72, 0.6);
    border-radius: 0px 100px 0px 0px;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    font-size: 16px;
    line-height: 24px;
    padding-left: 25px;
    position: relative;
    .dispatch-header__icon {
      position: absolute;
      left: 10px;
      width: 0;
      height: 24px;

      &::before {
        content: ' ';
        position: absolute;
        width: 12px;
        height: 12px;
        top: 6px;
        border-radius: 3px;
        border: 2px solid rgba(77, 217, 242, 1);
        transform: rotate(45deg);
      }
      &::after {
        content: ' ';
        position: absolute;
        width: 9px;
        height: 9px;
        top: 8px;
        left: 8px;
        border-radius: 3px;
        border: 2px solid rgba(77, 217, 242, 1);
        transform: rotate(45deg);
      }
    }
    .dispatch-header__label {
      color: rgba(255, 255, 255, 1);
      font-size: 16px;
      margin-left: 10px;
      font-family: PingFangSC-Medium;
      white-space: nowrap;
      text-align: left;
    }
  }
  .dispatch-header__extra {
    position: absolute;
    right: 40px;
    top: 25px;
    display: flex;
    justify-content: flex-end;
    align-content: center;
  }
}
</style>
