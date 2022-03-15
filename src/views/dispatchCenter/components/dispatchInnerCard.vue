<template>
  <div class="sl-disptach-inner-card">
    <div class="sl-dispatch-inner-card__header">
      <span class="sl-dispatch-inner-card__header-title">{{ title }}</span>
    </div>
    <div class="sl-dispatch-inner-card__main">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DispatchInnerCard',
  props: {
    title: {
      type: String,
      default: '统计内容'
    }
  },
  setup() {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
.sl-disptach-inner-card {
  color: #ffffff;
  margin: 0 40px 34px 40px;
  .sl-dispatch-inner-card__header {
    height: 31px;
    margin: 0 0 0 16px;
    padding-top: 11px;
    .sl-dispatch-inner-card__header-title {
      font-size: 14px;
      line-height: 20px;
    }
  }
  .sl-dispatch-inner-card__main{
    margin: 0 7px 7px 7px;
  }
}
</style>
