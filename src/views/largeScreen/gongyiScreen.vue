<template>
  <iframe
    ref="iframe"
    frameborder="0"
    scrolling="auto"
    :src="url"
    width="100%"
    height="100%"
  ></iframe>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  setup() {
    const url = ref<string>('')
    onMounted(()=>{
      url.value='http://139.155.92.140:7081/viewer/GZLNkrhVipKuE4go'
    })
    return {
      url
    }
  }
})
</script>

<style lang="scss" scoped></style>
