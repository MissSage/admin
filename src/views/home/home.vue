<template>
  <div class="wrapper">
    <div class="info">
      <p>Lgs's vue demo</p>
    </div>
  </div>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  setup () {
    return {
    }
  }
})
</script>
<style scoped lang='scss'>
.wrapper{
width:100%;
height:100%;
display: flex;
.info{
  margin: auto;
}
}
</style>
