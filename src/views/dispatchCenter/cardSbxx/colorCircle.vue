<template>
  <div class="sl-color-circle">
    <div
      class="sl-color-circle__top"
      :style="'background-color:' + backgroundColor + ';border-color:' + borderColor"
    >
      <span class="sl-color-circle__value">{{ value }}</span>
    </div>
    <span class="sl-color-circle__label">{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ColorCircle',
  props: {
    label: {
      default: '描述信息',
      type: String
    },
    value: {
      type: Number,
      default: 1000
    },
    backgroundColor: {
      type: String,
      default: '#8feefd'
    },
    borderColor: {
      type: String,
      default: '#49d0f2'
    }
  },
  setup() {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
.sl-color-circle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  font-size: 14px;
  margin-bottom: 16px;
  margin-top: 7px;
  font-family: PingFangSC-Medium, PingFang SC;
  .sl-color-circle__top {
    width: 64px;
    height: 64px;
    margin-bottom: 8px;
    background: #8feefd;
    border: 5px solid #49d0f2;
    border-radius: 50% 50%;
    text-align: center;
    .sl-color-circle__value {
      font-weight: 600;
      color: #333333;
      line-height: 54px;
    }
  }
  .sl-color-circle__label {
    height: 20px;
    font-weight: 500;
    color: #718092;
    line-height: 20px;
  }
}
</style>
