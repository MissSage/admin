<template>
  <div class="dispatch-describe-header">
    <span>{{ title }}</span>
    <div class="dispatch-describe-extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DispatchDescribeHeader',
  props: {
    title: {
      type: String,
      default: '描述信息'
    }
  },
  setup() {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
.dispatch-describe-header {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4dd9f2;
  line-height: 20px;
  margin-left: 10px;
  margin-bottom: 15px;
  position: relative;
  &::before {
    content: ' ';
    position: absolute;
    left: -10px;
    width: 2px;
    height: 20px;
    background: #4dd9f2;
  }
  .dispatch-describe-extra {
    position: absolute;
    right: 44px;
    top: 0;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #718092;
    line-height: 20px;
  }
}
</style>
