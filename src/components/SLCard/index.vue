<template>
  <div
    class="sl-card"
    :class="title ? 'hastitle' : ''"
    :style="height ? 'height:' + height + 'px' : ''"
  >
    <div v-if="title" class="sl-card-title">
      <slot name="title">
        <span class="title">{{ typeof title === 'string' ? title : '' }}</span>
      </slot>
      <slot name="query"></slot>

      <slot name="right"></slot>
    </div>
    <div class="sl-card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SLCard',
  props: {
    title: {
      type: [String, Boolean],
      default: ''
    },
    height: {
      type: Number,
      default: null
    }
  },
  setup () {
    //
  }
})
</script>

<style lang="scss" scoped>
.sl-card {
  width: 100%;
  border-radius: 4px;
  // background-color: #222536;
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5);
  .sl-card-content {
    height: 100%;
  }
  // 有标题的块
  &.hastitle {
    padding: 50px 8px 8px 8px;

    .sl-card-title {
      color: #a0a6c5;
      font-size: 18px;
      height: 50px;
      line-height: 50px;
      margin-top: -50px;
      display: flex;
      align-content: center;
      align-items: center;
      .title {
        margin-right: auto;
      }
    }
  }
}
</style>
