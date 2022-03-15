<template>
  <div class="dispatch-order-item">
    <span class="dispatch-order-item__value" :style="'color:' + color">{{ value }}</span>
    <span class="dispatch-order-item__label">{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OrderHeaderItem',
  props: {
    value: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: '描述信息'
    },
    color: {
      type: String,
      default: '#53ecff'
    }
  },
  setup() {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
.dispatch-order-item {
  width: 154px;
  height: 56px;
  background: rgba(21, 52, 80, 0.6);
  border-radius: 1px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  text-align: center;
  .dispatch-order-item__value {
    height: 32px;
    font-size: 16px;
    color: #53ecff;
    line-height: 32px;
  }
  .dispatch-order-item__label {
    height: 17px;
    font-size: 12px;
    color: #718092;
    line-height: 17px;
    display: block;
  }
}
</style>
