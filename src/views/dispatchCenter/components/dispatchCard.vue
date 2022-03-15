<template>
  <div class="sl-dispatch-card">
    <slot name="header"><DispatchCardHeader /></slot>
    <div class="sl-dispatch-card__main"><slot></slot></div>
    <div class="sl-dispatch-card__footer"><slot name="footer"></slot></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DispatchCardHeader from './dispatchCardHeader.vue'
export default defineComponent({
  name: 'DispatchCard',
  components:{ DispatchCardHeader },
  setup() {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  margin: 0;
  color: #ffffff;
  overflow: hidden;
  
}
</style>
