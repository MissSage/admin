
<template>
  <div class="flex-container">
    <div class="flex-item">
      <h2>This is Title</h2>
      <p>This item sits right in the middle of its container...</p>
      <el-button><a href="src/pages/icons.html" target="_blank">图标</a></el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Home',
  setup () {

  }
})

</script>

<style lang="scss" scoped>
.flex-container{
  height: 100%;
  display: flex;
  text-align: center;
}
.flex-item{
  margin: auto;
}
</style>
