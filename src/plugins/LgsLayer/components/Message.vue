<template>
  <div class="lgs-message" :class="'lgs-message'+type">
    <div v-if="title" class="lgs-message-title">{{ title }}</div>
    <div class="lgs-message-content">
      <i
        v-if="icon"
        class="icon iconfont"
        :class="icon"
      ></i>
      <span class="lgs-message-info">{{ message }}</span>
      <i class="icon iconfont icon-close" @click="$emit('close')"></i>
    </div>
  </div>
</template>
<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Message',
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'info'
    }
  },
  emits: ['close']
})
</script>
<style scoped lang='scss'>
.lgs-message{
  width:100%;
  .lgs-message-title{
    font-size:14px;
  }
  .lgs-message-content{
    line-height: 25px;
    font-size: 12px;
    display: flex;
    flex-direction:'row';
    justify-content: center;
    align-content: center;
    .lgs-message-info{
      flex: 1;
    }
    .icon-close{
      cursor: pointer;
    }
  }
}
</style>
