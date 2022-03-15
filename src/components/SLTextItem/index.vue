<template>
  <div class="text-box">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SLTextItem',
  setup () {
    // codes here
  }
})
</script>

<style lang="scss" scoped>
.text-box {
  width: 100%;
  height: 48px;
  padding: 14px;
  background: #313444;
  border-radius: 4px;
  border: 1px solid #42455b;
  color: #ffffff;
  font-size: 14px;
  line-height: 20px;
}
</style>
